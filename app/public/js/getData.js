const fetchProductsByFilters  = async function (search = '%00', category = '%00', currentOffset = 0)
{
    //You gotta fix this later
    // if(search == null)
    //     {
    //         search = '%00';
    //     }
    // if(category == null)
    //     {
    //         category = '%00';
    //     }
    // if(currentOffset == null)
    //     {
    //         currentOffset = 0;
    //     }    
    try
    {        
        const response = await fetch
            (`https://localhost:7230/api/Product?name=${search}&category=${category}&offset=${currentOffset}&limit=12`);
        if (!response.ok) {            
            throw new Error(`HTTP error! Status: ${response.status}`);
        }                
        const data = await response.json();  
        console.log(data);                
        return data;
    }
    catch
    {
        console.error('Error fetching data:', error);
    }    
}

const getCookie = function (name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}
const getQueryParams = function () {
    let params = {};
    window.location.search.substring(1).split("&").forEach(function(part) {
        let item = part.split("=");
        params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
    });
    return params;
}
async function fetchProductsById(parsedStoredUserShoppingCart) {    
    let productsAndQuantities = [];
    for(const product of parsedStoredUserShoppingCart.products)
        {
            try
            {
                const response = await fetch(`https://localhost:7230/api/Product/${product.productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json(); 
                productsAndQuantities.push({
                    product: data,
                    quantity: product.quantity
                })
            }
            catch
            {
                console.error('Error fetching data:', error);
            }
        }        
    return productsAndQuantities;
}

export 
{
    fetchProductsByFilters,
    fetchProductsById,
    getCookie,
    getQueryParams
}