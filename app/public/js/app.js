import { fetchProductsByFilters, getCookie } from "./getData.js";

//Declarations
let currentOffset;  
let category;
let search;
const indexUrl = './?';


document.addEventListener('DOMContentLoaded', () => 
    {                
        initPage();
    })

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
            }                
        createItemSection(searchParam, categoryParam, currentOffsetParam);
        addOnClickEvents();    
        
    }    


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
    createPaginationSection();
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
function createPaginationSection()
{
    const itemSectionContainer = document.querySelector('.item-section-container');
    const paginationContainer = document.createElement('section');
    paginationContainer.classList.add('pagination-container');
    paginationContainer.innerHTML = `
            <button class="page-toggle" id="previous-btn">
                Anterior
            </button>
            <button class="page-toggle" id="next-btn">
                Siguiente
            </button>
    `;
    itemSectionContainer.appendChild(paginationContainer);    
    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', () =>
        {
            nextPage(search);
        })
    const previousBtn = document.getElementById('previous-btn');
    previousBtn.addEventListener('click', () =>
        {
            previousPage(search);
        })    
}


//Rendering - Paginado
function searchProduct(search)
{
    let encodedUrl = encodeParams(indexUrl, search)
    window.open(encodedUrl, '_self'); 
}
function nextPage(search = '%00')
{        
    const cards = document.querySelectorAll('.item-card');
    if(cards.length < 12)
        {
            alert("You cant do that");
        }
    else
    {
        currentOffset = parseInt(currentOffset) + 12;         
        let encodedUrl = encodeParams(indexUrl, search, category, currentOffset)
        window.open(encodedUrl, '_self');  
    }      
}
function previousPage(search = '%00')
{
    if (currentOffset <= 0)
        {
            alert("You cant do that");
        }
    else
    {
        currentOffset = parseInt(currentOffset) - 12;    
        let encodedUrl = encodeParams(indexUrl, search, category, currentOffset)
        window.open(encodedUrl, '_self');
    }
    
}
//Rendering - CardCreation
async function createItemSection(search = '%00', category = '%00', currentOffset = 0)
{    
    console.log("Firing");
    fetchByPromises(search, category, currentOffset);
    // let products = await fetchProductsByFilters(search, category, currentOffset);    
    // createCards(products);
}

function fetchByPromises(search, category, currentOffset)
{
    document.getElementById('loading-spinner').style.display = 'flex';
    fetch
            (`https://localhost:7230/api/Product?name=${search}&category=${category}&offset=${currentOffset}&limit=12`)
    .then(response => response.json())
    .then(data => {createCards(data)})
    .catch(error => 
        {
            console.log('Error fetching products', error);
        })
    .finally(() => 
        {
            document.getElementById('loading-spinner').style.display = 'none';
            // document.querySelectorAll('.item-section-content').style.display = 'block';
        })
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
    filterButton.classList.toggle('active');
    filterButton.childNodes[1].classList.toggle('active');
}
function encodeParams(url, search, category = '%00', currentOffset = 0) {
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
function filterByCategory(categoryName, search = '%00')
{        
    if(categoryName == category)
        {
            window.open(indexUrl, '_self');
        }
    else
    {
        let encodedUrl = encodeParams(indexUrl, search, categoryName, currentOffset)
        window.open(encodedUrl, '_self');    
    }    
}











