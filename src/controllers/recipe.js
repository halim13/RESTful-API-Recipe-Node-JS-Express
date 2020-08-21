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
    const recipeId = request.params.recipeId
    try {
      const recipes = await Recipe.detail(recipeId)
      const ingredientsGroup = await Recipe.ingredientsGroup(recipeId)
      const steps = await Recipe.steps(recipeId)
      let ingredientsGroupsData = []
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

      function ingredients(i) {
        let ingredientsData = []
        let t1 = ingredientsGroup[i].uuid_child == null ? (ingredientsData = []) : ingredientsGroup[i].uuid_child.split(",")
        let t2 = ingredientsGroup[i].body_child == null ? (ingredientsData = []) : ingredientsGroup[i].body_child.split(",")
        for (let z = 0; z < t1.length; z++) {
          ingredientsData.push({
            uuid: t1[z],
            body: t2[z]
          })
        }
        return ingredientsData
      } 

      for (let i = 0; i < ingredientsGroup.length; i++) {
        ingredientsGroupsData.push({
          uuid: ingredientsGroup[i].uuid_group,
          body: ingredientsGroup[i].body_group,
          ingredients: ingredients(i)
        })
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
        ingredientsGroup: ingredientsGroupsData,
        steps: stepsData
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
      const allCategories = await Recipe.allCategory()
      const recipes = await Recipe.edit(recipeId)
      const ingredientsGroup = await Recipe.ingredientsGroup(recipeId)
      const steps = await Recipe.steps(recipeId)
      let ingredientsGroupsData = []
      let recipesData = []
      let categoriesData = []
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
      function categoryList() {
        let category_list = []
        for (let i = 0; i < allCategories.length; i++) {
          category_list.push({
            id: allCategories[i].id,
            uuid: allCategories[i].uuid,
            title: allCategories[i].title,
            color: allCategories[i].color,
            cover: allCategories[i].cover
          })
        }
        return category_list
      }
      function ingredients(i) {
        let ingredientsData = []
        let t1 = ingredientsGroup[i].uuid_child == null ? (ingredientsData = []) : ingredientsGroup[i].uuid_child.split(",")
        let t2 = ingredientsGroup[i].body_child == null ? (ingredientsData = []) : ingredientsGroup[i].body_child.split(",")
        for (let z = 0; z < t1.length; z++) {
          ingredientsData.push({
            uuid: t1[z],
            body: t2[z]
          })
        }
        return ingredientsData
      } 
      for (let i = 0; i < ingredientsGroup.length; i++) {
        ingredientsGroupsData.push({
          uuid: ingredientsGroup[i].uuid_group,
          body: ingredientsGroup[i].body_group,
          ingredients: ingredients(i)
        })
      }
      for (let i = 0; i < steps.length; i++) {
        stepsData.push({
          uuid: steps[i].uuid,
          body: steps[i].body,
          stepsImages: stepsImages(i)
        })
      }
      for (let i = 0; i < recipes.length; i++) {
        let categoryId = recipes[i].category_id
        const categories = await Recipe.getCategory(categoryId)
        recipesData.push({
          uuid: recipes[i].uuid,
          title: recipes[i].title,
          duration: recipes[i].duration,
          imageUrl: recipes[i].imageUrl,
          category_name: categories[0].title,
          category_list: categoryList(),
        })
      }
      const payload = {
        recipes: recipesData,
        ingredientsGroup: ingredientsGroupsData,
        steps: stepsData
      }
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },
  store: async (request, response) => {
    const path = "/public/images/recipe/"
    const title = request.body.title
    const categoryName = request.body.categoryName
    const getCategoryByTitle = await Recipe.getCategoryByTitle(categoryName)
    const duration = request.body.duration
    const userId = request.body.userId
    const username = await User.auth(userId)
    const ingredientsGroup = JSON.parse(request.body.ingredientsGroup)
    const ingredients = JSON.parse(request.body.ingredients)
    const steps = JSON.parse(request.body.steps)

    try {


      let dataRecipe = new (function () {
        this.uuid = uuidv4()
        this.title = title
        this.imageurl = request.files !==  "" ? `${username[0].name}-${this.uuid}-${request.files.imageurl.name}` : ""
        this.category_id = getCategoryByTitle[0].uuid
        this.duration = duration
        this.user_id = userId
      })()

      if(request.files) {
        await request.files.imageurl.mv(`${process.cwd()}${path}${username[0].name}-${dataRecipe.uuid}-${request.files.imageurl.name}`)
      }
     
      
      // Create Recipe
      await Recipe.store(dataRecipe)
      
      // Create or Update Ingredients Group & Ingredients Child
      for(let i = 0; i < ingredientsGroup.length; i++) {
        for (let z = 0; z < ingredients.length; z++) { 
          await Recipe.storeIngredientsGroup(ingredientsGroup[i].uuid, ingredientsGroup[i].item)
          await Recipe.storeIngredients(ingredients[z].uuid, ingredients[z].item, dataRecipe.uuid, ingredients[z].ingredient_group_id)
        }
      }

      // Store steps
      for (let i = 0; i < steps.length; i++) {
        await Recipe.storeSteps(uuidv4(), steps[i].item, dataRecipe.uuid) 
      } 
     
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
      const pathStepsImages = "/public/images/steps-images/"
      const pathRecipe = "/public/images/recipe/"
      const recipeId = request.params.recipeId
      const title = request.body.title
      const categoryName = request.body.categoryName
      const getCategoryByTitle = await Recipe.getCategoryByTitle(categoryName)
      const duration = request.body.duration
      const userId = request.body.userId
      const username = await User.auth(userId)
      const ingredientsGroup = JSON.parse(request.body.ingredientsGroup)
      const removeIngredientsGroup = JSON.parse(request.body.removeIngredientsGroup)
      const ingredients = JSON.parse(request.body.ingredients)
      const removeIngredients = JSON.parse(request.body.removeIngredients)
      const steps = JSON.parse(request.body.steps)
      const removeSteps = JSON.parse(request.body.removeSteps)
    
      let dataRecipe = new (function () {
        this.uuid = recipeId
        this.title = title
        // this.imageurl = request.files !==  "" ? `${username[0].name}-${this.recipeId}-${request.files.imageurl.name}` : ""
        this.category_id = getCategoryByTitle[0].uuid,
        this.duration = duration
        this.user_id = userId
      })

      // if(request.files) {
      //   await request.files.imageurl.mv(`${process.cwd()}${path}${username[0].name}-${dataRecipe.uuid}-${request.files.imageurl.name}`)
      // }

      // Update Recipe
      await Recipe.update(dataRecipe, recipeId)

      for (let i = 0; i < steps.length; i++) {
        let stepsId = steps[i].uuid
        let checkStepsImages = await Recipe.checkStepsImages(stepsId)
        if(checkStepsImages.length === 3) {
          for (let z = 0; z < 3; z++) {
            if (request.files) {
              if(typeof request.files[`imageurl-${i}-${z}`] !== "undefined") {
                let stepsImagesId = request.body[`stepsImagesId-${i}-${z}`];
                let file = request.files[`imageurl-${i}-${z}`]
                let getFileName = file.name.split("_")[0]
                let getFileExt = file.name.split(".").pop()
                let filename = getFileName.replace("image", `steps-images-${i}-${stepsImagesId}.${getFileExt}`)
                file.mv(`${process.cwd()}${pathStepsImages}${filename}`)
                await Recipe.storeStepsImage(
                  stepsImagesId,
                  filename,
                  stepsId
                )   
              }
            }
          }
        } else {
          for (let z = 0; z < 3; z++) {
            if (request.files) {
              if(typeof request.files[`imageurl-${i}-${z}`] !== "undefined") {
                let stepsImagesId = request.body[`stepsImagesId-${i}-${z}`];
                let file = request.files[`imageurl-${i}-${z}`]
                let getFileName = file.name.split("_")[0]
                let getFileExt = file.name.split(".").pop()
                let filename = getFileName.replace("image", `steps-images-${i}-${stepsImagesId}.${getFileExt}`)
                file.mv(`${process.cwd()}${pathStepsImages}${filename}`)
                await Recipe.storeStepsImage(
                  stepsImagesId,
                  filename,
                  stepsId
                )   
              } else {
                await Recipe.storeStepsImage(
                  uuidv4(),
                  'default-thumbnail.jpg',
                  stepsId
                )   
              }
            } 
          }
        }
      }

      // Create or Update Ingredients Group & Ingredients Child
      for(let i = 0; i < ingredientsGroup.length; i++) {
        for (let z = 0; z < ingredients.length; z++) { 
          await Recipe.storeIngredientsGroup(ingredientsGroup[i].uuid, ingredientsGroup[i].item)
          await Recipe.storeIngredients(ingredients[z].uuid, ingredients[z].item, dataRecipe.uuid, ingredients[z].ingredient_group_id)
        }
      }
      // Delete Ingredients Group
      for (let i = 0; i < removeIngredientsGroup.length; i++) {
        let idIngredientsGroup = removeIngredientsGroup[i].uuid
        await Recipe.deleteIngredientsGroup(idIngredientsGroup)
      }
      // Create or Update Ingredients
      for (let i = 0; i < ingredients.length; i++) {
        let uuid = ingredients[i].uuid
        let body = ingredients[i].item
        await Recipe.storeIngredients(uuid, body, recipeId)
      }
      // Delete Ingredients
      for (let i = 0; i < removeIngredients.length; i++) {
        let idIngredients = removeIngredients[i].uuid
        await Recipe.deleteIngredients(idIngredients)
      }
      // Create or Update Steps
      for (let i = 0; i < steps.length; i++) {
        let uuid = steps[i].uuid
        let body = steps[i].item
        await Recipe.storeSteps(uuid, body, recipeId)
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
