app.component("product", {
  template: /* vue-html */ `
    <section class="product">
      <div class="product__thumbnails">
        <div
          v-for="(image, index) in product.images"
          :key="image.thumbnail"
          class="thumb"
          :class="{ active: activeImage === index }"
          :style="{ backgroundImage: 'url(' + product.images[index].thumbnail + ')'}"
          @click="activeImage = index"
        ></div>
      </div>
      <div class="product__image">
        <img :src="product.images[activeImage].image" :alt="product.name" />
      </div>
    </section>
    <section class="description">
      <h4>
        {{ product.name.toUpperCase() }} {{ product.stock === 0 ? "no" :
        "si"}} 
        <badge :product="product"></badge>
      </h4>
      <p class="description__status" v-if="product.stock === 3">
        Quedan pocas unidades!
      </p>
      <p class="description__status" v-else-if="product.stock === 2">
        El producto esta por terminarse
      </p>
      <p class="description__status" v-else-if="product.stock === 1">
        Ultima unidad disponible!
      </p>
      <p class="description__price" :style="{ color: price_color }">
        $ {{ new Intl.NumberFormat("es-CO").format(product.price) }}
      </p>
      <p class="description__content">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis
        velit sequi adipisci, laboriosam minima dignissimos eius facere
        iste, distinctio fugiat dicta voluptatibus, fuga officiis vel saepe
        perspiciatis nobis quam? Autem!
      </p>
      <div class="discount">
        <span>Codigo de descuento:</span>
        <input
          type="text"
          placeholder="Ingresa tu codigo"
          @keyup.enter="applyDiscount($event)"
        />
      </div>
      <button :disabled="product.stock === 0" @click="sendToCart()">
        Agregar al carrito
      </button>
    </section>
  `,
  props: ["product"],
  emits: ["sendtocart"],
  setup(props, context) {
    const productState = reactive({
      activeImage: 0,
      price_color: "rgb(104, 104, 209)",
    });

    function sendToCart() {
      context.emit("sendtocart", props.product);
    }

    const discountCodes = ref(["PLATZI20", "JMRMEJIA"]);

    function applyDiscount(event) {
      const discountCodeIndex = discountCodes.value.indexOf(event.target.value);
      console.log(discountCodeIndex);
      if (discountCodeIndex >= 0) {
        props.product.price /= 2;
        discountCodes.splice(discountCodeIndex, 1);
      }
    }

    watch(
      () => productState.activeImage,
      (val, oldValue) => {
        console.log(val, oldValue);
      }
    );

    watch(
      () => props.product.stock,
      (stock) => {
        if (stock <= 1) {
          productState.price_color = "rgb(188, 30, 67)";
        }
      }
    );

    return {
      ...toRefs(productState),

      sendToCart,

      applyDiscount,
    };
  },
});
