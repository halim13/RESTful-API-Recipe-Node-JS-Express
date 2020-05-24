const config = require('../configs/configs');
const Meal = require('../models/Meal');
const { v4: uuidv4 } = require('uuid');
const misc = require('../helpers/response');
module.exports = {
  all: async (request, response) => {
    try {
      const payload = await Meal.all();
      misc.response(response, 200, false, null, payload);
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, 'Server Error.');
    }
  },
  show: async (request, response) => {
    const id = request.params.id;
    const page = parseInt(request.query.page) || 1;
    const search = request.query.search || '';
    const sort = request.query.sort || 'DESC';
    const limit = request.query.limit || 5;
    const offset = (page - 1) * limit;
    try {
      const categoryId = await Meal.getCategoryId(id);
      const total = await Meal.total(categoryId[0].id);
      const resultTotal = limit > 5 ? Math.ceil(total[0].total / limit) : total[0].total;
      const lastPage = Math.ceil(resultTotal / limit);
      const prevPage = page === 1 ? 1 : page - 1;
      const nextPage = page === lastPage ? 1 : page + 1;
      const payload = await Meal.show(offset, limit, sort, search, id);
      const pageDetail = {
        total: resultTotal,
        per_page: lastPage,
        next_page: nextPage,
        prev_page: prevPage,
        current_page: page,
        next_url: `${process.env.BASE_URL}${request.originalUrl.replace('page=' + page, 'page=' + nextPage)}`,
        prev_url: `${process.env.BASE_URL}${request.originalUrl.replace('page=' + page, 'page=' + prevPage)}`
      }
      misc.responsePagination(response, 200, false, null, pageDetail, payload);
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, 'Server Error.');
    }
  },
  detail: async (request, response) => {
    const id = request.params.id
    try {
      const meals = await Meal.detail(id);
      const ingredients = await Meal.ingredients(id);
      const steps = await Meal.steps(id);
      const payload = {
        meals,
        ingredients,
        steps
      };
      misc.response(response, 200, false, null, payload);
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, 'Server Error.');
    }
  },
  favourite: async (request, response) => {
  	try {
  	  const payload = await Meal.favourite();
  	  misc.response(response, 200, false, null, payload);
  	} catch(error) {
  	  console.log(error.message);
  	  misc.response(response, 500, true, 'Server Error');
  	}
  },
  searchSuggestions: async (request, response) => {
    try {
      const payload = await Meal.searchSuggestions();
      misc.response(response, 200, false, null, payload);
    } catch(error) {
      console.log(error.message);  // in-development
      misc.response(response, 500, true, 'Server Error');
    }
  },
  popularViews: async (request, response) => {
    let payload;
    const id = request.params.id;
    const idSearchSuggestions = uuidv4();
    try {
      const checkReservedSearchSuggestions = await Meal.checkReservedSearchSuggestions(id);
      if(checkReservedSearchSuggestions.length !== 0) {
        if(checkReservedSearchSuggestions[0].meal_id === id) {
          const getCountViews = await Meal.getCountViews(id);
          payload = await Meal.updateSearchSuggestions(getCountViews[0].views, id);
        }
      }
      else {
        payload = await Meal.storeSearchSuggestions(idSearchSuggestions, id);
      }
      misc.response(response, 200, false, null, payload);
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, 'Server Error.');
    }
  },
  updateFavourite: async (request, response) => {
    const id = request.params.id;
	  const isFavourite = request.body.isFavourite;
    try {
  	  const payload = await Meal.updateFavourite(id, isFavourite);
  	  misc.response(response, 200, false, null, payload);
  	} catch(error) {
  	  console.log(error.message); // in-development
  	  misc.response(response, 500, true, 'Server Error.');
  	}
  },
}
