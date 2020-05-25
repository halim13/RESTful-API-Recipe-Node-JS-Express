const misc = require('../helpers/response');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const Recipe = require('../models/Recipe');
const Meal = require('../models/Meal');
const User = require('../models/User');
module.exports = {
  store: async (request, response) => {
    const filename = request.files.imageurl;
    const path = '/public/images/recipe/';
    const title = request.body.title;
    const categoryId = request.body.categoryId;
    const userId = request.body.userId;
    const username = await User.auth(userId);
    const ingredients = JSON.parse(request.body.ingredients);
    const steps = JSON.parse(request.body.steps);
    try {
      let dataMeal = new function() {
        this.id = uuidv4();
        this.title = title;
        this.imageurl = `${username[0].name}-${this.id}-${filename.name}`;
        this.category_id = categoryId;
        this.user_id = userId;
      };
      await filename.mv(`${process.cwd()}${path}${username[0].name}-${dataMeal.id}-${filename.name}`);
      await Meal.store(dataMeal);
      steps.forEach( async (value, index) => {
        let dataSteps = {
          id: uuidv4(),
          body: value.item,
          meal_id: dataMeal.id
        };
        await Recipe.storeSteps(dataSteps);
      });
      ingredients.forEach( async (value, index) => {
        let dataIngredients = {
          id: uuidv4(),
          body: value.item,
          meal_id: dataMeal.id
        };
        await Recipe.storeIngredients(dataIngredients);
      });
      misc.response(response, false, 200, null, null);
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, true, 500, 'Server Error');
    }
  }
}
