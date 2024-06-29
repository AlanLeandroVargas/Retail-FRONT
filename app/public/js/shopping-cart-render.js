import { formatNumber,
    buyShoppingCart,    
    ComputeAll,
    computeQuantity,
    addProductToCart,
    decreaseProductFromCart,
    deleteProductFromCart,
    } 
from "./shopping-cart-logic.js";
import { fetchProductsById , getCookie } from "./getData.js";

let shoppingCart = 
        {
            products: []
        };
document.addEventListener('DOMContentLoaded', () => 
    {        
        initPage();
    });

function initPage()
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    if(storedUserShoppingCart != undefined && storedUserShoppingCart)
        {
            let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
            let shoppingCart = parsedStoredUserShoppingCart;
            if(shoppingCart.products.length != 0)
                {
                    renderItemsAmount(shoppingCart.products.length);
                    renderCards();
                    renderSummary();
                }
            else
            {
                renderNoProducts();
            }            
        } 
    else
    {            
        renderNoProducts();
    }
}
//Rendering
function renderNoProducts()
{
    const summary = document.querySelector('.summary-section-container');
    const productList = document.querySelector('.product-list-section');
    const noProduct = document.querySelector('.no-product');
    summary.style.display = 'none';
    productList.style.display = 'none';
    noProduct.style.display = 'flex';
}
function renderModal()
{    
    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
    const modalBtn = document.querySelector('.product-list-btn');
    modalBtn.addEventListener('click', () => 
        {
            window.open('/', '_self');
        })
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        window.open('/', '_self'); 
        }
    }
}

function renderItemsAmount(productAmount)
{    
    let amountIcon = document.querySelector('.amount-icon');
    if(productAmount > 0)
        {            
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }   
    else
    {
        amountIcon.style.display = 'none';
    }
}
//CHAT CODE ---------------------------------------------------------------------------------------------------------

function createCards(productsAndQuantities) {
    const spinner = document.querySelector('#loading-spinner');
    spinner.style.display = 'none';

    const productList = document.querySelector('.product-list-section');
    const fragment = document.createDocumentFragment();

    productsAndQuantities.forEach(productAndQuantity => {
        const newCard = createProductCard(productAndQuantity);
        fragment.appendChild(newCard);
    });

    productList.appendChild(fragment);
}

function createProductCard(productAndQuantity) {
    const { product, quantity } = productAndQuantity;

    const newCard = document.createElement('section');
    newCard.classList.add('product-container', `id-${product.id}`);

    const productContentContainer = createProductContentContainer(product, quantity);
    newCard.appendChild(productContentContainer);

    return newCard;
}

function createProductContentContainer(product, quantity) {
    const productContentContainer = document.createElement('section');
    productContentContainer.classList.add('product-content-container');

    const productImageContainer = createProductImageContainer(product.imageUrl);
    productContentContainer.appendChild(productImageContainer);

    const productInformationContainer = createProductInformationContainer(product, quantity);
    productContentContainer.appendChild(productInformationContainer);

    return productContentContainer;
}

function createProductImageContainer(imageUrl) {
    const productImageContainer = document.createElement('section');
    productImageContainer.classList.add('product-image-container');
    productImageContainer.innerHTML = `
            <img src="${imageUrl}">
    `;
    const imgElement = productImageContainer.querySelector('img');
    imgElement.onerror = function() {
        this.onerror = null; // Prevent infinite loop in case default image is also not available
        this.src = "./img/notFound.png";
    };       
    return productImageContainer;
}

function createProductInformationContainer(product, quantity) {
    const productInformationContainer = document.createElement('section');
    productInformationContainer.classList.add('product-information-container');

    const productNameContainer = createProductNameContainer(product.name);
    productInformationContainer.appendChild(productNameContainer);

    const productBtnContainer = createProductBtnContainer(product.id);
    productInformationContainer.appendChild(productBtnContainer);

    const productQuantityPriceContainer = createProductQuantityPriceContainer(product, quantity);
    productInformationContainer.appendChild(productQuantityPriceContainer);

    return productInformationContainer;
}

function createProductNameContainer(name) {
    const productNameContainer = document.createElement('section');
    productNameContainer.classList.add('product-name-container');
    const productName = document.createElement('h3');
    productName.innerHTML = name;
    productNameContainer.appendChild(productName);
    return productNameContainer;
}

function createProductBtnContainer(productId) {
    const productBtnContainer = document.createElement('section');
    productBtnContainer.classList.add('btn-container');
    const productBtn = document.createElement('button');
    productBtn.innerHTML = "Eliminar";
    productBtn.addEventListener('click', () => updateProductsList(productId));
    productBtnContainer.appendChild(productBtn);
    return productBtnContainer;
}

function createProductQuantityPriceContainer(product, quantity) {
    const productQuantityPriceContainer = document.createElement('section');
    productQuantityPriceContainer.classList.add('quantity-price-container');

    const productQuantityContainer = createProductQuantityContainer(product.id, quantity);
    productQuantityPriceContainer.appendChild(productQuantityContainer);

    const price = document.createElement('h3');
    price.innerHTML = `$ ${formatNumber(product.price)}`;
    productQuantityPriceContainer.appendChild(price);

    return productQuantityPriceContainer;
}

function createProductQuantityContainer(productId, quantity) {
    const productQuantityContainer = document.createElement('section');
    productQuantityContainer.classList.add('quantity-container');

    const increaseBtn = document.createElement('button');
    increaseBtn.classList.add('quantity-button');
    increaseBtn.innerText = "+";
    increaseBtn.addEventListener('click', () => addProductToCart(productId));
    increaseBtn.addEventListener('click', () => updateProductQuantities(productId, true, 1));
    increaseBtn.addEventListener('click', () => updateSummaryTotal());

    const quantitySpan = document.createElement('span');
    quantitySpan.classList.add(`quantity-${productId}`);
    quantitySpan.innerHTML = quantity;

    const decreaseBtn = document.createElement('button');
    decreaseBtn.classList.add('quantity-button', `decrease-${productId}`);
    decreaseBtn.innerText = "-";
    decreaseBtn.addEventListener('click', () => decreaseProductFromCart(productId));
    decreaseBtn.addEventListener('click', () => updateProductQuantities(productId, false, 1));
    decreaseBtn.addEventListener('click', () => updateSummaryTotal());
    if (quantity <= 1) {
        decreaseBtn.disabled = true;
    }

    productQuantityContainer.appendChild(decreaseBtn);
    productQuantityContainer.appendChild(quantitySpan);
    productQuantityContainer.appendChild(increaseBtn);

    return productQuantityContainer;
}

//CHAT CODE ---------------------------------------------------------------------------------------------------------
async function renderCards() 
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);     
    let productsAndQuantities = await fetchProductsById(parsedStoredUserShoppingCart);
    createCards(productsAndQuantities);
}


async function renderSummary()
{
    const priceTotal = document.querySelector('.price-total-value');
    const productQuantity = document.querySelector('.price-product-quantity');   
    const buyBtn = document.getElementById('buy-btn');
    buyBtn.addEventListener('click', () => {
        buyShoppingCart();
        renderItemsAmount(0);
        renderModal();;
    }); 
    const storedUserShoppingCart = getCookie('shoppingCart');
    const parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);  
    const productsAndQuantities = await fetchProductsById(parsedStoredUserShoppingCart);
    const total = await ComputeAll(productsAndQuantities);    
    priceTotal.innerHTML = total;
    const quantity = computeQuantity(productsAndQuantities);
    productQuantity.innerHTML = quantity;
}
async function updateSummaryTotal()
{
    const storedUserShoppingCart = getCookie('shoppingCart');
    const parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);  
    const priceTotal = document.querySelector('.price-total-value');
    const productsAndQuantities = await fetchProductsById(parsedStoredUserShoppingCart);
    const total = await ComputeAll(productsAndQuantities);    
    priceTotal.innerHTML = total;
}
function updateProductQuantities(productId, add, amount)
{                
    if(add)
        {
            const productQuantity = document.querySelector(`.quantity-${productId}`);
            productQuantity.innerHTML = parseInt(productQuantity.innerHTML) + 1;
            updateSummaryQuantities(true, amount);            
            const decreaseBtn = document.querySelector(`.decrease-${productId}`);
            if(decreaseBtn.disabled)
                {
                    decreaseBtn.disabled = false; 
                } 
        }
    else
    {
        const productQuantity = document.querySelector(`.quantity-${productId}`);
        productQuantity.innerHTML = parseInt(productQuantity.innerHTML) - 1;
        updateSummaryQuantities(false, amount);
        if(parseInt(productQuantity.innerHTML) <= 1)
            {
                let decreaseBtn = document.querySelector(`.decrease-${productId}`);                    
                decreaseBtn.disabled = true; 
            }
    }
    
}
function updateSummaryQuantities(add, amount)
{
    const productsQuantities = document.querySelector('.price-product-quantity');
    if(add)
        {
            productsQuantities.innerHTML = parseInt(productsQuantities.innerHTML) + amount;
        }
    else
    {
        productsQuantities.innerHTML = parseInt(productsQuantities.innerHTML) - amount;
    }
}
function updateProductsList(productId)
{
    const {isThereProductsLeft, amount} = deleteProductFromCart(productId)
    if(isThereProductsLeft)
        {
            updateSummaryQuantities(false, amount);
        }
    else
    {
        renderNoProducts();
    }
    renderItemsAmount(amount);
    deleteProductCard(productId)
}
function deleteProductCard(productId)
{
    let productCard = document.querySelector(`.id-${productId}`);    
    productCard.remove();    
}





