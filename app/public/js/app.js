import { fetchProductsByFilters, getCookie } from "./getData.js";
//Test
//Declarations
let currentOffset;  
let category;
let search;
const indexUrl = './?';
//Retrieving Data
document.addEventListener('DOMContentLoaded', () => 
    {                
        initPage();
    })

function addOnClickEvents()
{
    const filterButtons = document.querySelectorAll('.filter-button');
    for(let button of filterButtons)
        {            
            button.addEventListener('click', () =>
                {
                    filterByCategory(button.id);
                })         
        }   
    const searchBar = document.querySelector('#searchBar');
    searchBar.addEventListener('keydown', (e) =>
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
//CHAT CODE ---------------------------------------------------------------------------------------------------------
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
    const imgSrc = product.imageUrl || "./img/notFound.png";
    newCard.innerHTML = `
        <section class="image-container">
            <img src="${imgSrc}" alt="${product.name}">
        </section>
        <section class="content-result-container">
            ${createProductName(product.name)}
            ${createPriceSection(product.price, product.discount)}
        </section>
    `;
    const imgElement = newCard.querySelector('img');
    imgElement.onerror = function() {
        this.onerror = null; // Prevent infinite loop in case default image is also not available
        this.src = "./img/notFound.png";
    };
    newCard.addEventListener('click', () => openProductDetailPage(product.id));
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
//CHAT CODE ---------------------------------------------------------------------------------------------------------

//Rendering - Paginado
function searchProduct(search)
{
    let encodedUrl = encodeParams(indexUrl, search, category, currentOffset)
    window.open(encodedUrl, '_self'); 
}
function nextPage(search = '%00')
{        
    currentOffset = parseInt(currentOffset) + 12;         
    let encodedUrl = encodeParams(indexUrl, search, category, currentOffset)
    window.open(encodedUrl, '_self');    
}
function previousPage(search = '%00')
{
    currentOffset = parseInt(currentOffset) - 12;    
    let encodedUrl = encodeParams(indexUrl, search, category, currentOffset)
    window.open(encodedUrl, '_self');
}
//Rendering - CardCreation
async function createItemSection(search = '%00', category = '%00', currentOffset = 0)
{    
    
    let products = await fetchProductsByFilters(search, category, currentOffset);    
    createCards(products);
}
//Redirectioning
function openProductDetailPage(value)
{    
    window.open('./product_detail?value=' + encodeURIComponent(value), '_self');
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
    const filterButton = document.getElementById(`${category}`);
    filterButton.childNodes[1].classList.toggle('active');
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
    let encodedUrl = encodeParams(indexUrl, search, category, currentOffset)
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
    createItemSection(searchParam, categoryParam, currentOffsetParam);
    addOnClickEvents();    
    createPagination();
}

function createPagination()
{
    const itemSectionContainer = document.querySelector('.item-section-container');
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
    itemSectionContainer.appendChild(paginationContainer); 
}









