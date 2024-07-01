import { getCookie, getQueryParams, fetchProductById, fetchProductsByFilters } from "./getData.js";

let shoppingCart = 
        {
            products: []
        };
let search;
let currentOffset;
//CHAT CODE -------------------------------------

function InitCarrousel()
{    
    const carousel = document.querySelector('.item-section-content');    
    const items = document.querySelectorAll('.item-card');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    let currentIndex = 0;
    const itemsPerView = 3; // Number of items to show per view

    function updateCarousel() {
    const itemWidth = items[0].clientWidth + parseInt(getComputedStyle(carousel).columnGap);
    const maxIndex = Math.max(0, items.length - itemsPerView); // Ensure we don't go below 0
    currentIndex = Math.min(currentIndex, maxIndex); // Prevents the index from going out of range
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

    // Toggle visibility of carousel controls based on currentIndex
  if (currentIndex === 0) {
    prevButton.style.display = 'none';
  } else {
    prevButton.style.display = 'block';
  }

  if (currentIndex >= items.length - (itemsPerView + 2)) {
    nextButton.style.display = 'none';
  } else {
    nextButton.style.display = 'block';
  }
  }
  prevButton.addEventListener('click', function () {
    currentIndex -= itemsPerView;
    if (currentIndex < 0) {
      currentIndex = Math.max(0, items.length - itemsPerView);
    }
    updateCarousel();
  });

  nextButton.addEventListener('click', function () {
    currentIndex += itemsPerView;
    if (currentIndex > items.length - itemsPerView) {
      currentIndex = 0;
    }
    updateCarousel();
  });

  // Update carousel on window resize
  window.addEventListener('resize', updateCarousel);
  
  // Initial update to set the correct transform
  updateCarousel();
}
//CHAT CODE------------------------------------------

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
            shoppingCart = parsedStoredUserShoppingCart;
            renderItemsAmount(shoppingCart.products.length);
        };
    createProductDetails();
    addListeners();
    setTimeout(InitCarrousel, 500); 
    toggleSpinner(); 
}

function toggleSpinner()
{
    const spinner = document.getElementById('loading-spinner');
    if(spinner.style.display == 'none')
        {
            spinner.style.display = 'flex';
        }
    else
    {
        spinner.style.display = 'none';
    }
}

function addListeners()
{
    const searchBar = document.querySelector('#searchBar');
    searchBar.addEventListener('keydown', (e) =>
        {        
            if(e.key == 'Enter')
                {
                    searchProduct(searchBar.value);                        
                }                
        });  
    const modalBtn = document.querySelector('.shopping-cart-btn');
    modalBtn.addEventListener('click', () =>
        {
            window.open("./shopping_cart", "_self");
        })
}

function searchProduct(search)
{
    let encodedUrl = encodeParams('/?', search)
    window.open(encodedUrl, '_self'); 
}
function encodeParams(url, search, category = '%00', currentOffset = 0) {
    const searchParams = new URLSearchParams();
    searchParams.set('search', search);
    searchParams.set('category', category);
    searchParams.set('currentOffset', currentOffset);    
    return `${url}${searchParams.toString()}`;
}

//Render
function renderModal()
{
    const modal = document.querySelector('.modal');
    const priceSectionHeader = document.querySelector('.price-section-header');
    const productNameContainer = document.querySelector('.product-name');
    let productName = priceSectionHeader.innerHTML;
    productNameContainer.innerHTML = productName;
    modal.style.display = 'block';
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}
function renderItemsAmount(productAmount)
{
    if(productAmount != 0)
        {
            let amountIcon = document.querySelector('.amount-icon');
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }    
}
//CHAT CODE ---------------------------------------------------------------------------------------------------------
async function createProductDetails() {
    try {
        let params = getQueryParams();
        let id = params["value"];        
        const product = await fetchProductById(id);        
        const fragment = document.createDocumentFragment();

        const imageContainer = createImageContainer(product.imageUrl);
        fragment.appendChild(imageContainer);

        const productDetailContainer = createProductDetailContainer(product.description);
        fragment.appendChild(productDetailContainer);

        const priceSectionContainer = createPriceSectionContainer(product);
        fragment.appendChild(priceSectionContainer);

        document.querySelector('.product-container').appendChild(fragment);
        createCarrousel(product.category.name, product.id);
        

        
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

function createImageContainer(imageUrl) {
    const imageContainer = document.createElement('section');
    imageContainer.classList.add('image-container');
    imageContainer.innerHTML = `
            <img src="${imageUrl}">
    `;
    const imgElement = imageContainer.querySelector('img');
    imgElement.onerror = function() {
        this.onerror = null; // Prevent infinite loop in case default image is also not available
        this.src = "./img/notFound.png";
    };   
    
    return imageContainer;
}

function createProductDetailContainer(description) {
    const productDetailContainer = document.createElement('section');
    productDetailContainer.classList.add('product-detail-container');

    const productDetailContainerHeader = document.createElement('section');
    productDetailContainerHeader.classList.add('product-detail-container-header');
    const detailHeader = document.createElement('h2');
    detailHeader.innerHTML = "Descripcion";
    productDetailContainerHeader.appendChild(detailHeader);
    productDetailContainer.appendChild(productDetailContainerHeader);

    const productDetailContainerContent = document.createElement('section');
    productDetailContainerContent.classList.add('product-detail-container-content');
    const detail = document.createElement('p');
    detail.innerHTML = description;
    productDetailContainerContent.appendChild(detail);
    productDetailContainer.appendChild(productDetailContainerContent);

    return productDetailContainer;
}

function createPriceSectionContainer(product) {
    const priceSectionContainer = document.createElement('section');
    priceSectionContainer.classList.add('price-section-container');

    const priceSectionHeader = createPriceSectionHeader(product.name);
    priceSectionContainer.appendChild(priceSectionHeader);

    const priceSectionContent = createPriceSectionContent(product.price, product.discount);
    priceSectionContainer.appendChild(priceSectionContent);

    const priceSectionBottom = createPriceSectionBottom(product.id);
    priceSectionContainer.appendChild(priceSectionBottom);

    return priceSectionContainer;
}

function createPriceSectionHeader(name) {
    const priceSectionHeader = document.createElement('section');
    priceSectionHeader.classList.add('price-section-header');
    const truncatedName = name.length > 42 ? `${name.slice(0, 42)}...` : name;
    priceSectionHeader.innerHTML = `
    <h4>${truncatedName}</h4>
    `;        
    return priceSectionHeader;
}

function createPriceSectionContent(price, discount) {
    const priceSectionContent = document.createElement('section');
    priceSectionContent.classList.add('price-section-content');
    if (discount > 0) {
        const actualPrice = price - (price * (discount / 100));
        priceSectionContent.innerHTML = `
        <p class="price-without-discount">$${formatNumber(price)}</p>
        <section class="price-with-discount-container">
            <p>$${formatNumber(actualPrice)}</p><p class="percentage-off">${discount}% OFF</p>
        </section>
        `;        
    } else {
        priceSectionContent.innerHTML = `
        <p class="price-without-discount">$${formatNumber(price)}</p>        
        `;
    }

    return priceSectionContent;
}

function createPriceSectionBottom(productId) {
    const priceSectionBottom = document.createElement('section');
    priceSectionBottom.classList.add('price-section-bottom');
    const cartBtnContainer = document.createElement('section');
    cartBtnContainer.classList.add('cart-btn-container');
    const cartBtn = document.createElement('button');
    cartBtn.classList.add('cart-btn');
    cartBtn.innerText = "Agregar al carrito";
    cartBtn.addEventListener('click', () => addProduct(productId));
    cartBtnContainer.appendChild(cartBtn);
    priceSectionBottom.appendChild(cartBtnContainer);
    return priceSectionBottom;
}

//CHAT CODE ---------------------------------------------------------------------------------------------------------
async function createCarrousel(category, id)
{
    let products = await fetchProductsByFilters(search, category, currentOffset); 
    const productsWithoutTheDetailedProduct = products.filter(product => product.id !== id);     
    createCards(productsWithoutTheDetailedProduct);
}

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
    newCard.addEventListener('click', () =>
        {
            window.open('./product_detail?value=' + encodeURIComponent(product.id), '_self')
        });
    return newCard;
}

function createProductName(name) {
    const truncatedName = name.length > 42 ? `${name.slice(0, 42)}...` : name;
    return `
        <section class="name-container">
            <p>${truncatedName}</p>
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

//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
function addProduct(productId)
{
    let product = shoppingCart.products.find(p => p.productId == productId);
    if(product)
        {
            product.quantity += 1;
        }
    else
    {
        shoppingCart.products.push({
            productId: productId,
            quantity: 1
        });
    }    
    let shoppingCartInfoString = JSON.stringify(shoppingCart); 
    document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;
    renderItemsAmount(shoppingCart.products.length);
    renderModal();
}



