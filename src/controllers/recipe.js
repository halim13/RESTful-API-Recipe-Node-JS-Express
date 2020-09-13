const misc = require("../helpers/response")
const fs = require("fs-extra")
const { v4: uuidv4 } = require("uuid")
const Recipe = require("../models/Recipe")
const Category = require("../models/Category")
const User = require("../models/User")

module.exports = {
  
  getRecipes: async (request, response) => {
    try {
      const payload = await Recipe.getRecipes()
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error.")
    }
  },

  show: async (request, response) => {
    const categoryId = request.params.categoryId
    const page = parseInt(request.query.page) || 1
    const search = request.query.search || ""
    const limit = request.query.limit || 5
    const offset = (page - 1) * limit
    try {
      const category = await Category.getCategory(categoryId)
      const categoryTotal = await Category.getTotalByCategoryId(category[0].uuid)
      const resultTotal = limit > 5 ? Math.ceil(categoryTotal[0].total / limit) : categoryTotal[0].total
      const lastPage = Math.ceil(resultTotal / limit)
      const prevPage = page === 1 ? 1 : page - 1
      const nextPage = page === lastPage ? 1 : page + 1
      const recipesData = await Recipe.show(offset, limit, search, categoryId)
      let recipes = []
      for (let i = 0; i < recipesData.length; i++) {   
        recipes.push({
          uuid: recipesData[i].uuid,
          title: recipesData[i].title,
          duration: recipesData[i].duration,
          portion: recipesData[i].portion,
          imageurl: recipesData[i].imageurl,
          user: {
            uuid: recipesData[i].user_id,
            name: recipesData[i].name
          },
          category: {
            title: recipesData[i].category_title
          },
          country: {
            name: recipesData[i].country_name
          }
        })
      }
      const payloadPageDetail = {
        total: resultTotal,
        per_page: lastPage,
        next_page: nextPage,
        prev_page: prevPage,
        current_page: page,
        next_url: `${process.env.BASE_URL}${request.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
        prev_url: `${process.env.BASE_URL}${request.originalUrl.replace("page=" + page, "page=" + prevPage)}`
      }
      misc.responsePagination(response, 200, false, null, payloadPageDetail, recipes)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },

  showMe: async(request, response) => {
    const userId = request.params.userId
    const page = parseInt(request.query.page) || 1
    const search = request.query.search || ""
    const limit = request.query.limit || 5
    const offset = (page - 1) * limit
    try {
      const user = await User.getUserByUuid(userId)
      const userTotal = await User.getTotalByUserId(user[0].uuid)
      const resultTotal = limit > 5 ? Math.ceil(userTotal[0].total / limit) : userTotal[0].total
      const lastPage = Math.ceil(resultTotal / limit)
      const prevPage = page === 1 ? 1 : page - 1
      const nextPage = page === lastPage ? 1 : page + 1
      const recipesData = await Recipe.showMe(offset, limit, search, userId)
      let recipes = []
      for (let i = 0; i < recipesData.length; i++) {   
        recipes.push({
          uuid: recipesData[i].uuid,
          title: recipesData[i].title,
          duration: recipesData[i].duration,
          portion: recipesData[i].portion,
          imageurl: recipesData[i].imageurl,
          user: {
            uuid: recipesData[i].user_id,
            name: recipesData[i].name
          },
          category: {
            title: recipesData[i].category_title
          },
          country: {
            name: recipesData[i].country_name
          }
        })
      }
      const payloadPageDetail = {
        total: resultTotal,
        per_page: lastPage,
        next_page: nextPage,
        prev_page: prevPage,
        current_page: page,
        next_url: `${process.env.BASE_URL}${request.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
        prev_url: `${process.env.BASE_URL}${request.originalUrl.replace("page=" + page, "page=" + prevPage)}`
      }
      misc.responsePagination(response, 200, false, null, payloadPageDetail, recipes)
    } catch(error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },


  showDraft: async (request, response) => {
    const userId = request.params.userId
    const page = parseInt(request.query.page) || 1
    const search = request.query.search || ""
    const limit = request.query.limit || 5
    const offset = (page - 1) * limit
 
    try {
      const recipesData = await Recipe.showDraft(offset, limit, search, userId)
      let recipes = []
      for (let i = 0; i < recipesData.length; i++) {   
        recipes.push({
          uuid: recipesData[i].uuid,
          title: recipesData[i].title,
          duration: recipesData[i].duration,
          portion: recipesData[i].portion,
          ispublished: recipesData[i].ispublished,
          imageurl: recipesData[i].imageurl,
          user: {
            uuid: recipesData[i].user_id,
            name: recipesData[i].name
          },
          category: {
            title: recipesData[i].category_title
          },
          country: {
            name: recipesData[i].country_name
          }
        })
      }
   
      misc.response(response, 200, false, null, recipes)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
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


      let recipesData = []
      recipesData.push({
        uuid: recipes[0].uuid,
        title: recipes[0].title,
        imageurl: recipes[0].imageurl,
        portion: recipes[0].portion,
        duration: recipes[0].duration,
        isfavorite: recipes[0].isfavorite,
        user: {
          uuid: recipes[0].user_id,
          name: recipes[0].name
        },
        category: {
          title: recipes[0].category_title
        },
        country: {
          name: recipes[0].country_name
        }
      })


      function stepsImages(i) {
        let stepsImagesData = []
        let id = steps[i].id
        let t0 = steps[i].steps_images_id == null ? (stepsImagesData = []) : steps[i].steps_images_id.split(",")
        let t1 = steps[i].steps_images_uuid == null ? (stepsImagesData = []) : steps[i].steps_images_uuid.split(",")
        let t2 = steps[i].steps_images_body == null ? (stepsImagesData = []) : steps[i].steps_images_body.split(",")
        for (let z = 0; z < t0.length; z++) {
          stepsImagesData.push({
            id: parseInt(t0[z]),
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
        let t1 = ingredientsGroup[i].uuid_child == null ? (ingredientsData = []) : ingredientsGroup[i].uuid_child.split("*")
        let t2 = ingredientsGroup[i].body_child == null ? (ingredientsData = []) : ingredientsGroup[i].body_child.split("*")
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

  popularViews: async (request, response) => {
    let payload
    const recipeId = request.params.recipeId
    const idSearchSuggestions = uuidv4()
    try {
      const checkReservedSearchSuggestions = await Recipe.checkReservedSearchSuggestions(recipeId)
      if (checkReservedSearchSuggestions.length !== 0) {
        if (checkReservedSearchSuggestions[0].recipe_id === recipeId) {
          const getCountViews = await Recipe.getCountViews(recipeId)
          payload = await Recipe.updateSearchSuggestions(getCountViews[0].views, recipeId)
        }
      } else {
        payload = await Recipe.storeSearchSuggestions(idSearchSuggestions, recipeId)
      }
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },

  favorite: async (request, response) => {
    try {
      const recipes = await Recipe.favorite()

      let recipesData = []
      for (let i = 0; i < recipes.length; i++) {
        recipesData.push({
          uuid: recipes[i].uuid,
          title: recipes[i].title,
          imageurl: recipes[i].imageurl,
          portion: recipes[i].portion,
          duration: recipes[i].duration,
          isfavorite: recipes[i].isfavorite,
          user: {
            uuid: recipes[i].user_id,
            name: recipes[i].name
          },
          category: {
            title: recipes[i].category_title
          },
          country: {
            name: recipes[i].country_name
          }
        })
      }

      misc.response(response, 200, false, null, recipesData)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },
  
  searchSuggestions: async (request, response) => {
    try {
      const recipesData = await Recipe.searchSuggestions()
      let recipes = []
      for (let i = 0; i < recipesData.length; i++) {   
        recipes.push({
          uuid: recipesData[i].uuid,
          title: recipesData[i].title,
          duration: recipesData[i].duration,
          portion: recipesData[i].portion,
          imageurl: recipesData[i].imageurl,
          user: {
            uuid: recipesData[i].user_id,
            name: recipesData[i].name
          },
          category: {
            title: recipesData[i].category_title
          },
          country: {
            name: recipesData[i].country_name
          }
        })
      }
      misc.response(response, 200, false, null, recipes)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },

  edit: async (request, response) => {
    const recipeId = request.params.recipeId
    try {
      const allCategories = await Category.getCategories()
      const allFoodCountries = await Category.getFoodCountries()
      const recipes = await Recipe.edit(recipeId)
      const ingredientsGroup = await Recipe.ingredientsGroup(recipeId)
      const steps = await Recipe.steps(recipeId)
      let ingredientsGroupsData = []
      let recipesData = []
      let categoriesData = []
      let stepsData = []
      function stepsImages(i) {
        let stepsImagesData = []
        let id = steps[i].id
        let t0 = steps[i].steps_images_id == null ? (stepsImagesData = []) : steps[i].steps_images_id.split(",")
        let t1 = steps[i].steps_images_uuid == null ? (stepsImagesData = []) : steps[i].steps_images_uuid.split(",")
        let t2 = steps[i].steps_images_body == null ? (stepsImagesData = []) : steps[i].steps_images_body.split(",")
        for (let z = 0; z < t0.length; z++) {
          stepsImagesData.push({
            id: parseInt(t0[z]),
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
      function foodCountryList() {
        let food_country_list = []
        for (let i = 0; i < allFoodCountries.length; i++) {
          food_country_list.push({
            id: allFoodCountries[i].id,
            uuid: allFoodCountries[i].uuid,
            name: allFoodCountries[i].name,
          })
        }
        return food_country_list
      }
      function ingredients(i) {
        let ingredientsData = []
        let t1 = ingredientsGroup[i].uuid_child == null ? (ingredientsData = []) : ingredientsGroup[i].uuid_child.split("*")
        let t2 = ingredientsGroup[i].body_child == null ? (ingredientsData = []) : ingredientsGroup[i].body_child.split("*")
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
        let countryId = recipes[i].country_id
        const categories = await Category.getCategory(categoryId)
        const countries = await Category.getCountry(countryId)
        recipesData.push({
          uuid: recipes[i].uuid,
          title: recipes[i].title,
          duration: recipes[i].duration,
          imageUrl: recipes[i].imageUrl,
          portion: recipes[i].portion,
          ispublished: recipes[i].ispublished,
          category_name: categories[0].title,
          food_country_name: countries[0].name,
          category_list: categoryList(),
          food_country_list: foodCountryList()
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
    let responseMessage = ""
    let filename = ""
    const pathStepsImages = "/public/images/steps-images/"
    const pathRecipe = "/public/images/recipe/"
    const title = request.body.title
    const duration = request.body.duration
    const portion = request.body.portion
    const categoryName = request.body.categoryName
    const countryName = request.body.foodCountryName
    const isPublished = request.body.isPublished
    const getCategoryByTitle = await Category.getCategoryByTitle(categoryName)
    const getFoodCountryByName = await Category.getFoodCountryByName(countryName)
    const userId = request.body.userId
    const username = await User.auth(userId)
    const ingredientsGroup = JSON.parse(request.body.ingredientsGroup)
    const ingredients = JSON.parse(request.body.ingredients)
    const steps = JSON.parse(request.body.steps)

    try {

      const checkDemo = await Recipe.checkDemo(userId)

      if(checkDemo[0].total == 6) {
        responseMessage = 'ALERTDEMO'
      } else {

        if(request.files) {
          if(typeof request.files.imageurl !== "undefined") {
            let getFileName = request.files.imageurl.name.split("_")[0]
            let getFileExt = request.files.imageurl.name.split(".").pop()
            filename = getFileName.replace("scaled", `recipe-${new Date().getUTCMilliseconds()}.${getFileExt}`)
            request.files.imageurl.mv(`${process.cwd()}${pathRecipe}${filename}`)
          }
        }

        let dataRecipe = new (function () {
          this.uuid = uuidv4()
          this.title = title
          this.category_id = getCategoryByTitle[0].uuid
          this.country_id = getFoodCountryByName[0].uuid
          if(request.files) {
            if(typeof request.files.imageurl !== "undefined") {
              this.imageurl = filename
            }
          }
          this.portion = portion
          this.duration = duration
          this.ispublished = parseInt(isPublished)
          this.user_id = userId
        })()

        let dataDemo = {
          "uuid": uuidv4(),
          "user_id": userId,
          "recipe_id": dataRecipe.uuid
        }

        // Store Demo
        await Recipe.storeDemo(dataDemo)
     
     
        // Store Recipe
        await Recipe.store(dataRecipe)

        for (let i = 0; i < steps.length; i++) {
          let stepsId = steps[i].uuid
          let checkStepsImages = await Recipe.checkStepsImages(stepsId)
          await Recipe.storeSteps(stepsId, steps[i].item, dataRecipe.uuid) 
          if(checkStepsImages.length === 3) {
            for (let z = 0; z < 3; z++) {
              if (request.files) {
                if(typeof request.files[`imageurl-${i}-${z}`] !== "undefined") {
                  let stepsImagesId = request.body[`stepsImagesId-${i}-${z}`];
                  let file = request.files[`imageurl-${i}-${z}`]
                  let getFileName = file.name.split("_")[0]
                  let getFileExt = file.name.split(".").pop()
                  let filename = getFileName.replace("scaled", `steps-images-${i}-${new Date().getUTCMilliseconds()}-${stepsImagesId}.${getFileExt}`)
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
                  let filename = getFileName.replace("scaled", `steps-images-${i}-${new Date().getUTCMilliseconds()}-${stepsImagesId}.${getFileExt}`)
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
             
        // Store or Update Ingredients Group & Ingredients Child
        for(let i = 0; i < ingredientsGroup.length; i++) {
          for (let z = 0; z < ingredients.length; z++) { 
            await Recipe.storeIngredientsGroup(ingredientsGroup[i].uuid, ingredientsGroup[i].item)
            await Recipe.storeIngredients(ingredients[z].uuid, ingredients[z].item, dataRecipe.uuid, ingredients[z].ingredient_group_id)
          }
        }
      }
     
      misc.response(response, false, 200, null, responseMessage)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, true, 500, "Server Error")
    }
  },

  updateFavorite: async (request, response) => {
    const id = request.params.recipeId
    const isFavorite = request.body.isFavorite
    try {
      const payload = await Recipe.updateFavorite(id, isFavorite)
      misc.response(response, 200, false, null, payload)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },

  update: async (request, response) => {
    let filename = ""
    const pathStepsImages = "/public/images/steps-images/"
    const pathRecipe = "/public/images/recipe/"
    const recipeId = request.params.recipeId
    const title = request.body.title
    const duration = request.body.duration
    const categoryName = request.body.categoryName
    const foodCountryName = request.body.foodCountryName
    const ispublished = parseInt(request.body.isPublished)
    const portion = request.body.portion
    const getCategoryByTitle = await Category.getCategoryByTitle(categoryName)
    const getFoodCountryByName = await Category.getFoodCountryByName(foodCountryName)
    const userId = request.body.userId
    const username = await User.auth(userId)
    const ingredientsGroup = JSON.parse(request.body.ingredientsGroup)
    const removeIngredientsGroup = JSON.parse(request.body.removeIngredientsGroup)
    const ingredients = JSON.parse(request.body.ingredients)
    const removeIngredients = JSON.parse(request.body.removeIngredients)
    const steps = JSON.parse(request.body.steps)
    const removeSteps = JSON.parse(request.body.removeSteps)
    try {
      if(request.files) {
        if(typeof request.files.imageurl !== "undefined") { 
          let getFileName = request.files.imageurl.name.split("_")[0]
          let getFileExt = request.files.imageurl.name.split(".").pop()
          filename = getFileName.replace("scaled", `recipe-${new Date().getUTCMilliseconds()}.${getFileExt}`)
          request.files.imageurl.mv(`${process.cwd()}${pathRecipe}${filename}`)
        }
      }
    
      let dataRecipe = new (function () {
        this.uuid = recipeId
        this.title = title
        if(request.files) {
          if(typeof request.files.imageurl !== "undefined") {
            this.imageurl = filename
          }
        }
        this.portion = portion
        this.duration = duration
        this.ispublished = ispublished
        this.category_id = getCategoryByTitle[0].uuid
        this.country_id = getFoodCountryByName[0].uuid
        this.user_id = userId
      })

      
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
                console.log(file)
                let getFileName = file.name.split("_")[0]
                let getFileExt = file.name.split(".").pop()
                let filename = getFileName.replace("scaled", `steps-images-${i}-${new Date().getUTCMilliseconds()}-${stepsImagesId}.${getFileExt}`)
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
                let filename = getFileName.replace("scaled", `steps-images-${i}-${new Date().getUTCMilliseconds()}-${stepsImagesId}.${getFileExt}`)
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
      misc.response(response, true, 500, "Server Error")
    }
  }

}
