import { retrieveProducts, getCookie } from "./modules/getData.js";

//Declarations
let currentOffset;  
let category;
let search;
const INDEX_URL = './index.html?';
//Retrieving Data
document.addEventListener('DOMContentLoaded', () => 
    {                
        initPage();
    })

function addOnClickEvents()
{
    const FILTER_BUTTONS = document.querySelectorAll('.filter-button');
    for(let button of FILTER_BUTTONS)
        {            
            button.addEventListener('click', () =>
                {
                    filterByCategory(button.id);
                })         
        }   
    const SEARCH_BAR = document.querySelector('#searchBar');
    SEARCH_BAR.addEventListener('keydown', (e) =>
        {        
            if(e.key == 'Enter')
                {
                    searchProduct(searchBar.value);                        
                }                
        });        
}
//Render
function renderItemsAmount(productAmount)
{
    if(productAmount > 0)
        {
            let amountIcon = document.querySelector('.amount-icon');
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }    
}
// function createCards(products)
// {    
//     const ITEM_SECTION = document.querySelector('.item-section-content');
//     products.forEach(product => {
//         let newCard = document.createElement('article');
//         newCard.classList.add("item-card");
//         newCard.addEventListener('click', () => {openDetailProductPage(product.id)});
//         let cardImageContainer = document.createElement('section');
//         cardImageContainer.classList.add("image-container");
//         let cardImage = document.createElement('img');
//         cardImage.src = product.imageUrl;
//         cardImageContainer.appendChild(cardImage);
//         newCard.appendChild(cardImageContainer);

//         let contentResultContainer = document.createElement('section');
//         contentResultContainer.classList.add("content-result-container");

//         let productNameContainer = document.createElement('section');
//         productNameContainer.classList.add("name-container");
//         let productName = document.createElement('h5');
//         let productNameString = product.name;        
//         if(productNameString.length > 42)
//             {                
//                 productNameString = productNameString.slice(0, 42);
//                 productNameString = productNameString + '...';                
//             }
//         productName.innerHTML = productNameString;
//         productNameContainer.appendChild(productName);
//         contentResultContainer.appendChild(productNameContainer);

//         let priceAndCartContainer = document.createElement('section');
//         priceAndCartContainer.classList.add("price-and-cart-container");
        
//         let priceContainer = document.createElement('section');
//         priceContainer.classList.add("price-container");
//         let priceWithoutDiscount = document.createElement('p');
        
//         priceWithoutDiscount.innerHTML = "$" + formatNumber(product.price);
//         if(product.discount > 0)
//             {
//                 priceWithoutDiscount.classList.add('price-without-discount');
//                 let priceWithDiscountContainer = document.createElement('section');
//                 priceWithDiscountContainer.classList.add('price-with-discount-container');
//                 let priceWithDiscount = document.createElement('p');                
//                 let actualPrice = product.price - (product.price * (product.discount / 100));
//                 priceWithDiscount.innerHTML = "$" + formatNumber(actualPrice);
//                 let percentageOff = document.createElement('p');
//                 percentageOff.classList.add('percentage-off');
//                 percentageOff.innerHTML = `${product.discount}% OFF`;
//                 priceWithDiscountContainer.appendChild(priceWithDiscount);
//                 priceWithDiscountContainer.appendChild(percentageOff);                
//                 priceContainer.appendChild(priceWithoutDiscount);
//                 priceContainer.appendChild(priceWithDiscountContainer);

//             }
//         else
//         {
//             priceContainer.appendChild(priceWithoutDiscount);
//         }
        
//         priceAndCartContainer.appendChild(priceContainer);
//         contentResultContainer.appendChild(priceAndCartContainer);

//         newCard.appendChild(contentResultContainer);
//         ITEM_SECTION.append(newCard);
//     });        
// }

//CHAT CODE
function createCards(products) {
    const itemSection = document.querySelector('.item-section-content');
    const fragment = document.createDocumentFragment();
    products.forEach(product => {
        const newCard = createCard(product);
        fragment.appendChild(newCard);
    });
    itemSection.appendChild(fragment);
}

function createCard(product) {
    const newCard = document.createElement('article');
    newCard.classList.add('item-card');
    newCard.innerHTML = `
        <section class="image-container">
            <img src="${product.imageUrl}" alt="${product.name}">
        </section>
        <section class="content-result-container">
            ${createProductName(product.name)}
            ${createPriceSection(product.price, product.discount)}
        </section>
    `;
    newCard.addEventListener('click', () => openDetailProductPage(product.id));
    return newCard;
}

function createProductName(name) {
    const truncatedName = name.length > 42 ? `${name.slice(0, 42)}...` : name;
    return `
        <section class="name-container">
            <h5>${truncatedName}</h5>
        </section>
    `;
}

function createPriceSection(price, discount) {
    const priceWithoutDiscount = formatNumber(price);
    if (discount > 0) {
        const actualPrice = formatNumber(price - (price * (discount / 100)));
        return `
            <section class="price-and-cart-container">
                <section class="price-container">
                    <p class="price-without-discount">$${priceWithoutDiscount}</p>
                    <section class="price-with-discount-container">
                        <p>$${actualPrice}</p>
                        <p class="percentage-off">${discount}% OFF</p>
                    </section>
                </section>
            </section>
        `;
    } else {
        return `
            <section class="price-and-cart-container">
                <section class="price-container">
                    <p>$${priceWithoutDiscount}</p>
                </section>
            </section>
        `;
    }
}
//CHAT CODE
//Rendering - Paginado
function searchProduct(search)
{
    let encodedUrl = encodeParams(INDEX_URL, search, category, currentOffset)
    window.open(encodedUrl, '_self'); 
}
function nextPage(search = '%00')
{        
    currentOffset = parseInt(currentOffset) + 12;         
    let encodedUrl = encodeParams(INDEX_URL, search, category, currentOffset)
    window.open(encodedUrl, '_self');    
}
function previousPage(search = '%00')
{
    currentOffset = parseInt(currentOffset) - 12;    
    let encodedUrl = encodeParams(INDEX_URL, search, category, currentOffset)
    window.open(encodedUrl, '_self');
}
//Rendering - CardCreation
async function createItemSection(search = '%00', category = '%00', currentOffset = 0)
{    
    let products = await retrieveProducts(search, category, currentOffset);    
    createCards(products);
}
//Redirectioning
function openDetailProductPage(value)
{    
    window.open('./DetailProduct.html?value=' + encodeURIComponent(value), '_self');
}
// Functionality 
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
function activeCategory(category)
{
    const FILTER_BUTTON = document.getElementById(`${category}`);
    FILTER_BUTTON.childNodes[1].classList.toggle('active');
}
function encodeParams(url, search, category, currentOffset) {
    const searchParams = new URLSearchParams();
    searchParams.set('search', search);
    searchParams.set('category', category);
    searchParams.set('currentOffset', currentOffset);    
    return `${url}${searchParams.toString()}`;
}
function decodeParams(url) {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);
    
    return {
        search: (searchParams.get('search') != null) ? searchParams.get('search') : '%00',
        category: (searchParams.get('category') != null) ? searchParams.get('category') : '%00',
        currentOffset: (searchParams.get('currentOffset') != null) ? searchParams.get('currentOffset') : 0
    };
}
//Category Filter
function filterByCategory(category, search = '%00')
{        
    let encodedUrl = encodeParams(INDEX_URL, search, category, currentOffset)
    window.open(encodedUrl, '_self');    
}

function initPage()
{
    const {search: searchParam, category: categoryParam, currentOffset: currentOffsetParam} = 
                                                                                decodeParams(window.location.href); 
    search = searchParam;
    currentOffset = currentOffsetParam;  
    category = categoryParam;      
    if(category != '%00')
        {
            activeCategory(category);
        }   
    let storedUserShoppingCart = getCookie('shoppingCart');        
    if(storedUserShoppingCart != undefined && storedUserShoppingCart)
        {
            let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
            let shoppingCart = parsedStoredUserShoppingCart;
            renderItemsAmount(shoppingCart.products.length);            
            createItemSection(searchParam, categoryParam, currentOffsetParam);    
        }            
    else
    {
        createItemSection(searchParam, categoryParam, currentOffsetParam);            
    }
    addOnClickEvents();    
    createPagination();
}

function createPagination()
{
    const ITEM_SECTION_CONTAINER = document.querySelector('.item-section-container');
    let paginationContainer = document.createElement('section');
    paginationContainer.classList.add('pagination-container');
    let pagePreviousToggle = document.createElement('button');
    pagePreviousToggle.addEventListener('click', () => 
        {
            previousPage(search);
        });
    pagePreviousToggle.classList.add('page-toggle');
    pagePreviousToggle.innerHTML = "Anterior";
    paginationContainer.appendChild(pagePreviousToggle);    
    let pageNextToggle = document.createElement('button');
    pageNextToggle.addEventListener('click', () => 
        {
            nextPage(search);
        });
    pageNextToggle.classList.add('page-toggle');
    pageNextToggle.innerHTML = "Siguiente";
    paginationContainer.appendChild(pageNextToggle);  
    ITEM_SECTION_CONTAINER.appendChild(paginationContainer); 
}









