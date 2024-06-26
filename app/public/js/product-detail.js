import { getCookie, getQueryParams, fetchProductById } from "./getData.js";

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
    if(storedUserShoppingCart != undefined)
        {
            let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
            shoppingCart = parsedStoredUserShoppingCart;
            renderItemsAmount(shoppingCart.products.length);
        };
    createProductDetails();
}


//Render
function renderModal()
{
    const modal = document.querySelector('.modal');
    const priceSectionHeader = document.querySelector('.price-section-header');
    const productNameContainer = document.querySelector('.product-name');
    let productName = priceSectionHeader.firstChild.innerHTML;
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
    const detail = document.createElement('h4');
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
    const productName = document.createElement('h4');
    productName.innerHTML = name;
    priceSectionHeader.appendChild(productName);
    return priceSectionHeader;
}

function createPriceSectionContent(price, discount) {
    const priceSectionContent = document.createElement('section');
    priceSectionContent.classList.add('price-section-content');
    const productPriceWithoutDiscount = document.createElement('p');
    productPriceWithoutDiscount.innerHTML = `$${formatNumber(price)}`;

    if (discount > 0) {
        productPriceWithoutDiscount.classList.add('price-without-discount');
        const priceWithDiscountContainer = document.createElement('section');
        priceWithDiscountContainer.classList.add('price-with-discount-container');
        const priceWithDiscount = document.createElement('p');
        const actualPrice = price - (price * (discount / 100));
        priceWithDiscount.innerHTML = `$${formatNumber(actualPrice)}`;
        const percentageOff = document.createElement('p');
        percentageOff.classList.add('percentage-off');
        percentageOff.innerHTML = `${discount}% OFF`;
        priceWithDiscountContainer.appendChild(priceWithDiscount);
        priceWithDiscountContainer.appendChild(percentageOff);
        priceSectionContent.appendChild(productPriceWithoutDiscount);
        priceSectionContent.appendChild(priceWithDiscountContainer);
    } else {
        priceSectionContent.appendChild(productPriceWithoutDiscount);
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



