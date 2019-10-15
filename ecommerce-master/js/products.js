const ORDER_ASC_BY_PRICE = "Min a Max";
const ORDER_DESC_BY_PRICE = "Max a Min";
const ORDER_BY_RANK_PRICE = "Precio";

var currentProductsArray = [];
var currentSortCriteria = undefined;
var minPrice = undefined;
var maxPrice = undefined;


function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a,b){
            if (a.cost < b.cost) {return -1; }
            if (a.cost > b.cost) {return 1; }
            return 0
        });
    }
    else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a,b){
            if (a.cost > b.cost) {return -1; }
            if (a.cost < b.cost) {return 1; }
            return 0;
        });

    }
    else if (criteria === ORDER_BY_RANK_PRICE){
        result = array.sort(function(a,b){
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost > bCost) {return -1; }
            if (bCost < bCost) {return 1; }
            return 0
        });
    }
    return result;

}

function showProductsList(){
    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
        ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))){

        
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt=" " class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ product.name +`</h4>
                        <small class="text-muted">` +product.currency + "  " + product.cost + `</small>
                    </div>
                    <p ` + product.description + `</p>
                </div>
            </div>
            </div>
        `
        }
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
  
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currenProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });

    document.getElementById("ordAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("ordDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByPrice").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_RANK_PRICE);
    });
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterPrice").addEventListener("click", function(){

        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        
        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
            minPrice = parseInt(minPrice);
        }
        else{
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
            maxPrice = parseInt(maxPrice);
        }
        else{
            maxPrice = undefined;
        }

        showProductsList();
    });
});