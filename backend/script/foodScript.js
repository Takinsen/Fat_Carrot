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
        console.log(err)
    }

}

export const UpdateAfterPost = async(request)=>{

    try{
        const foodType = await typefood.findOne({name : request.tag});

        if(!foodType){
            throw new Error(`Food type '${request.tag}' does not exist.`);
        }

        if(foodType.num === 0){
            foodType.sumCal = request.cal;
            foodType.avgCal = request.cal;
            foodType.num = 1;
            await foodType.save();   
        }
        else{
            foodType.sumCal += request.cal;
            foodType.num += 1;
            foodType.avgCal = Math.round(foodType.sumCal / foodType.num);
            await foodType.save();
        }
    }
    catch(err){
        console.log(err)
    }

}