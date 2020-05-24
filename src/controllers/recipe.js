const misc = require('../helpers/response');
const { v4: uuidv4 } = require('uuid');
const Recipe = require('../models/Recipe');
const Meal = require('../models/Meal');
module.exports = {
  store: async (request, response) => {
    const title = request.body.title;
    const categoryId = request.body.categoryId;
    const userId = request.body.userId;
    const imageurl = request.file.fieldname;
    const ingredients = JSON.parse(request.body.ingredients);
    const steps = JSON.parse(request.body.steps);
    try {
      let dataMeal = {
        id: uuidv4(),
        title: title,
        imageurl: imageurl,
        category_id: categoryId,
        user_id: userId,
      };
      const getMealId = await Meal.store(dataMeal);
      steps.forEach( async (value, index) => {
        let dataSteps = {
          id: uuidv4(),
          body: value.item,
          meal_id: dataMeal.id
        }
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
