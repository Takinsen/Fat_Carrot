import allfood from '../model/foodData.js';
import typefood from '../model/foodType.js';


export const VerifyFoodType = async(search)=>{

    try{
        const filter = search ? {name : search} : {};
        const VerifyingFood = await typefood.find(filter);
        VerifyingFood.forEach(async(foodType) =>{
            const FoodDataInTag = await allfood.find({tag : foodType.name});
            foodType.sumCal = 0;
            foodType.num = FoodDataInTag.length;
            FoodDataInTag.forEach(FoodData => {foodType.sumCal = foodType.sumCal + FoodData.cal})
            foodType.avgCal = foodType.num > 0 ? Math.round(foodType.sumCal / foodType.num) : 0;
            await foodType.save();
        })
        return VerifyingFood;
    }
    catch(err){
        console.log(err);
    }

}