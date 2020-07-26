const misc = require("../helpers/response")
const fs = require("fs-extra")
const { v4: uuidv4 } = require("uuid")
const Recipe = require("../models/Recipe")
const User = require("../models/User")
module.exports = {
  all: async (request, response) => {
    try {
      const payload = await Recipe.all()
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error.")
    }
  },
  show: async (request, response) => {
    const categoryId = request.params.recipeId
    const page = parseInt(request.query.page) || 1
    const search = request.query.search || ""
    const limit = request.query.limit || 5
    const offset = (page - 1) * limit
    try {
      const category = await Recipe.getCategory(categoryId)
      const total = await Recipe.total(category[0].id)
      const resultTotal = limit > 5 ? Math.ceil(total[0].total / limit) : total[0].total
      const lastPage = Math.ceil(resultTotal / limit)
      const prevPage = page === 1 ? 1 : page - 1
      const nextPage = page === lastPage ? 1 : page + 1
      const payload = await Recipe.show(offset, limit, search, categoryId)
      const pageDetail = {
        total: resultTotal,
        per_page: lastPage,
        next_page: nextPage,
        prev_page: prevPage,
        current_page: page,
        next_url: `${process.env.BASE_URL}${request.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
        prev_url: `${process.env.BASE_URL}${request.originalUrl.replace("page=" + page, "page=" + prevPage)}`
      }
      misc.responsePagination(response, 200, false, null, pageDetail, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error.")
    }
  },
  detail: async (request, response) => {
    const id = request.params.recipeId
    try {
      const recipes = await Recipe.detail(id)
      const ingredients = await Recipe.ingredients(id)
      const steps = await Recipe.steps(id)
      const payload = {
        recipes,
        ingredients,
        steps
      }
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error.")
    }
  },
  popularViews: async (request, response) => {
    let payload
    const id = request.params.id
    const idSearchSuggestions = uuidv4()
    try {
      const checkReservedSearchSuggestions = await Recipe.checkReservedSearchSuggestions(id)
      if (checkReservedSearchSuggestions.length !== 0) {
        if (checkReservedSearchSuggestions[0].recipe_id === id) {
          const getCountViews = await Recipe.getCountViews(id)
          payload = await Recipe.updateSearchSuggestions(getCountViews[0].views, id)
        }
      } else {
        payload = await Recipe.storeSearchSuggestions(idSearchSuggestions, id)
      }
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error.")
    }
  },
  favourite: async (request, response) => {
    try {
      const payload = await Recipe.favourite()
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },
  searchSuggestions: async (request, response) => {
    try {
      const payload = await Recipe.searchSuggestions()
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },
  edit: async (request, response) => {
    const recipeId = request.params.recipeId
    try {
      const recipes = await Recipe.edit(recipeId)
      const ingredients = await Recipe.ingredients(recipeId)
      const steps = await Recipe.steps(recipeId)
      let stepsData = []
      function stepsImages(i) {
        let stepsImagesData = []
        let t1 = steps[i].steps_images_id == null ? (stepsImagesData = []) : steps[i].steps_images_id.split(",")
        let t2 = steps[i].steps_images_body == null ? (stepsImagesData = []) : steps[i].steps_images_body.split(",")
        for (let z = 0; z < t1.length; z++) {
          stepsImagesData.push({
            uuid: t1[z],
            body: t2[z]
          })
        }
        let result = stepsImagesData.sort(function(a, b) {
          return parseInt(a.id) - parseInt(b.id);
        });
        return result
      }
      for (let i = 0; i < steps.length; i++) {
        stepsData.push({
          uuid: steps[i].uuid,
          body: steps[i].body,
          stepsImages: stepsImages(i)
        })
      }
      const payload = {
        recipes,
        ingredients,
        steps: stepsData
      }
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },
  store: async (request, response) => {
    const filename = request.files.imageurl
    const path = "/public/images/recipe/"
    const title = request.body.title
    const categoryId = request.body.categoryId
    const userId = request.body.userId
    const username = await User.auth(userId)
    const ingredients = JSON.parse(request.body.ingredients)
    const steps = JSON.parse(request.body.steps)
    try {
      let dataRecipe = new (function () {
        this.id = uuidv4()
        this.title = title
        this.imageurl = `${username[0].name}-${this.id}-${filename.name}`
        this.category_id = categoryId
        this.user_id = userId
      })()
      // if(request.files.size >= 5120) { // 5 MB
      //   fs.unlink(`public/images/recipe/${username[0].name}-${this.id}-${filename.name}`);
      //   misc.response(response, true, 500, 'Server Error');
      // }
      await filename.mv(`${process.cwd()}${path}${username[0].name}-${dataRecipe.id}-${filename.name}`)
      await Recipe.store(dataRecipe)
      steps.forEach(async (value, index) => {
        let dataSteps = {
          id: uuidv4(),
          body: value.item,
          recipe_id: dataRecipe.uuid
        }
        await Recipe.storeSteps(dataSteps)
      })
      ingredients.forEach(async (value, index) => {
        let dataIngredients = {
          id: uuidv4(),
          body: value.item,
          recipe_id: dataRecipe.uuid
        }
        await Recipe.storeIngredients(dataIngredients)
      })
      misc.response(response, false, 200, null, null)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, true, 500, "Server Error")
    }
  },
  updateFavourite: async (request, response) => {
    const id = request.params.recipeId
    const isFavourite = request.body.isFavourite
    try {
      const payload = await Recipe.updateFavourite(id, isFavourite)
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error.")
    }
  },
  update: async (request, response) => {
    try {
      const path = "/public/images/steps-images/"
      const recipeId = request.params.recipeId
      const title = request.body.title
      const ingredients = JSON.parse(request.body.ingredients)
      const steps = JSON.parse(request.body.steps)
      const removeIngredients = JSON.parse(request.body.removeIngredients)
      const removeSteps = JSON.parse(request.body.removeSteps)

      
      for (let i = 0; i < steps.length; i++) {
        let stepsId = steps[i].uuid
        let array = [];
        let index = [];
        let stepsImageExists = [];
        for (let z = 0; z < 3; z++) {
          if (request.files) {
            if (typeof request.files[`imageurl-${i}-${z}`] !== "undefined") {
              stepsImagesId = request.body[`stepsImagesId-${i}-${z}`]
              let files = request.files[`imageurl-${i}-${z}`]
              let getFilesName = files.name.split("_")[0]
              let replaceFilesName = getFilesName.replace("image", `steps-images-${i}-${stepsImagesId}.jpg`)
              files.mv(`${process.cwd()}${path}${replaceFilesName}`)
              let checkStepsImages = await Recipe.checkStepsImages(stepsImagesId)
              array.push({
                "stepsImagesId": stepsImagesId,
                "file": replaceFilesName,
              })
              index.push(z)
              stepsImageExists.push(checkStepsImages.length)
              if (checkStepsImages.length === 1) {
                await Recipe.updateStepsImages(stepsImagesId, replaceFilesName)
              } 
            }   
          }
        }

        // Steps Images
        for (let k = 0; k < 3; k++) {
          let idx = index.indexOf(k);
          if(idx > -1) {
            if(stepsImageExists[0] === 0) {
              for (let i = 0; i < array.length; i++) {
                await Recipe.storeStepsImage(
                  array[i].stepsImagesId,
                  array[i].file,
                  recipeId, 
                  stepsId
                )      
              }
            }
          } else {
            if(stepsImageExists[0] === 0) {
              await Recipe.storeStepsImage(
                uuidv4(),
                'default-image.png',
                recipeId, 
                stepsId
              )    
            }
          }  
        }

      }


      // Update Title
      await Recipe.updateTitleRecipe(recipeId, title)

      // Create or Update Ingredients
      for (let i = 0; i < ingredients.length; i++) {
        let id = ingredients[i].uuid
        let body = ingredients[i].item
        await Recipe.storeIngredients(id, body, recipeId)
      }
      // Delete Ingredients
      for (let i = 0; i < removeIngredients.length; i++) {
        let idIngredients = removeIngredients[i].uuid
        await Recipe.deleteIngredients(idIngredients)
      }
      // Create or Update Steps
      for (let i = 0; i < steps.length; i++) {
        let id = steps[i].uuid
        let body = steps[i].item
        await Recipe.storeSteps(id, body, recipeId)
      }
      // Delete Steps
      for (let i = 0; i < removeSteps.length; i++) {
        let idSteps = removeSteps[i].uuid
        await Recipe.deleteSteps(idSteps)
      }
      misc.response(response, false, 200, null, null)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, true, 500, "Server Error.")
    }
  }
}
