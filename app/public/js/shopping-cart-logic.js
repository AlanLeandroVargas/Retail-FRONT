import { getCookie } from "./getData.js";
import { fetchProductsById } from "./getData.js";

function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
async function BuyShoppingCart()
{
    const storedUserShoppingCart = getCookie('shoppingCart');
    const parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);  
    const products = parsedStoredUserShoppingCart.products;    
    const productsAndQuantities = await fetchProductsById(parsedStoredUserShoppingCart);
    const subTotal = ComputeSubTotal(productsAndQuantities);
    const totalDiscount = ComputeTotalDiscount(productsAndQuantities);
    const totalPayed = ComputeTotal(subTotal, totalDiscount, 1.21);    
    const data = 
    {
        products,
        totalPayed
    };       
    await InsertSale(data);
    disposeCart();    
}
async function InsertSale(data)
{
    const response = await fetch('https://localhost:7230/api/Sale', {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)        
    })    
    return response.json();
}
async function ComputeAll(productsAndQuantities)
{        
    const subTotal = ComputeSubTotal(productsAndQuantities);    
    const totalDiscount = ComputeTotalDiscount(productsAndQuantities);    
    const total = ComputeTotal(subTotal, totalDiscount, 1.21);
    const roundedTotal = formatNumber(total);
    return roundedTotal;
}
function ComputeSubTotal(productsAndQuantities)
{    
    let total = 0;    
    productsAndQuantities.forEach(product => {        
        total += product.product.price * product.quantity        
    });
    return total;
}
function ComputeTotalDiscount(productsAndQuantities)
{
    let totalDiscount = 0;
    let percentage;
    let unitDiscount;
    productsAndQuantities.forEach(product => {
        if(product.product.discount > 0)
            {
                percentage = product.product.discount / 100;
                unitDiscount = product.product.price * percentage;
                totalDiscount += product.quantity * unitDiscount;
            }
    })
    return totalDiscount;
}
function ComputeTotal(subTotal, totalDiscount, taxes)
{
    const total = (subTotal - totalDiscount) * taxes;
    return total;
}
function computeQuantity(productsAndQuantities)
{
    let quantity = 0;
    productsAndQuantities.forEach(product => {  
        quantity += product.quantity;
    });
    return quantity;
}

function addProductToCart(productId)
{
    const storedUserShoppingCart = getCookie('shoppingCart');
    const parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);
    const product = parsedStoredUserShoppingCart.products.find(p => p.productId == productId);
    if(product)
        {
            product.quantity += 1;
        }
    const shoppingCartInfoString = JSON.stringify(parsedStoredUserShoppingCart); 
    document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;
        
}
function decreaseProductFromCart(productId)
{
    const storedUserShoppingCart = getCookie('shoppingCart');
    const parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);
    const product = parsedStoredUserShoppingCart.products.find(p => p.productId == productId);    
    if(product && product.quantity > 1)
        {
            product.quantity -= 1;
            const shoppingCartInfoString = JSON.stringify(parsedStoredUserShoppingCart); 
            document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;            
        }    
}
function deleteProductFromCart(productId)
{
    const storedUserShoppingCart = getCookie('shoppingCart');
    const parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);      
    const indexProduct = parsedStoredUserShoppingCart.products.findIndex(p => p.productId == productId);
    const product = parsedStoredUserShoppingCart.products[indexProduct];   
    parsedStoredUserShoppingCart.products.splice(indexProduct, 1);
    const shoppingCartInfoString = JSON.stringify(parsedStoredUserShoppingCart); 
    document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;
    if(parsedStoredUserShoppingCart.products.length == 0)
        {
            return {
                isThereProductsLeft: false,
                amount: 0
            };            
        }   
    else
    {
        return {
            isThereProductsLeft: true,
            amount: product.quantity
        };
    }        
}
function disposeCart()
{    
    document.cookie = `shoppingCart=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; max-age=3600`; 
}

export
{
    formatNumber,
    BuyShoppingCart,
    InsertSale,
    ComputeAll,
    computeQuantity,
    addProductToCart,
    decreaseProductFromCart,
    deleteProductFromCart
}