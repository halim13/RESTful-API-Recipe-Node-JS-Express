const misc = require("../helpers/response")
const fs = require("fs-extra")
const { v4: uuidv4 } = require("uuid")
const Recipe = require("../models/Recipe")
const Meal = require("../models/Meal")
const User = require("../models/User")
module.exports = {
  edit: async (request, response) => {
    const mealId = request.params.id
    try {
      const recipes = await Recipe.edit(mealId)
      const ingredients = await Meal.ingredients(mealId)
      const steps = await Meal.steps(mealId)
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
      let dataMeal = new (function () {
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
      await filename.mv(`${process.cwd()}${path}${username[0].name}-${dataMeal.id}-${filename.name}`)
      await Meal.store(dataMeal)
      steps.forEach(async (value, index) => {
        let dataSteps = {
          id: uuidv4(),
          body: value.item,
          meal_id: dataMeal.uuid
        }
        await Recipe.storeSteps(dataSteps)
      })
      ingredients.forEach(async (value, index) => {
        let dataIngredients = {
          id: uuidv4(),
          body: value.item,
          meal_id: dataMeal.uuid
        }
        await Recipe.storeIngredients(dataIngredients)
      })
      misc.response(response, false, 200, null, null)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, true, 500, "Server Error")
    }
  },
  update: async (request, response) => {
    try {
      const path = "/public/images/steps-images/"
      const mealId = request.params.mealId
      const title = request.body.title
      const ingredients = JSON.parse(request.body.ingredients)
      const steps = JSON.parse(request.body.steps)
      const removeIngredients = JSON.parse(request.body.removeIngredients)
      const removeSteps = JSON.parse(request.body.removeSteps)

      
      for (let i = 0; i < steps.length; i++) {
        let stepsId = steps[i].uuid
        let array = [];
        let index = [];
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
                "stepsImageExists": checkStepsImages.length
              })
              index.push(z)
              if (checkStepsImages.length == 1) {
                await Recipe.updateStepsImages(stepsImagesId, replaceFilesName)
              } 
            }   
          }
        }

        for (let k = 0; k < 3; k++) {
          let idx = index.indexOf(k);
          if(idx > -1) {
            for (let i = 0; i < array.length; i++) {
              await Recipe.storeStepsImage(
                array[i].stepsImagesId,
                array[i].file,
                mealId, 
                stepsId
              )      
            }
          } else {
            await Recipe.storeStepsImage(
              uuidv4(),
              'default-image.png',
              mealId, 
              stepsId
            )    
          }  
        }

      }



      // Update Title
      await Recipe.updateTitleRecipe(mealId, title)

      // Create or Update Ingredients
      for (let i = 0; i < ingredients.length; i++) {
        let id = ingredients[i].uuid
        let body = ingredients[i].item
        await Recipe.storeIngredients(id, body, mealId)
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
        await Recipe.storeSteps(id, body, mealId)
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
