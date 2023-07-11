<template>
  <div>
    <h1>Galeria</h1>
    <draggable-list
      :drag-items="images"
      vertical
      @dragged="images = $event"
    >
      <template #default="{ item }">
        <v-sheet class="my-2">
          <div class="d-flex">
            <v-img
              :src="item"
              max-width="50px"
            />
            <div>aboba</div>
          </div>
        </v-sheet>
      </template>
    </draggable-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      images: [
        'https://a-static.mlcdn.com.br/450x450/apple-iphone-13-128gb-rosa-tela-61-12mp/magazineluiza/234662000/62f1963b9dc397e6f317ae4fb8388f8e.jpg',
        'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_700,h_700/https://sotelefones.com/wp-content/uploads/2021/11/iphone_13_starlight_pdp_image_position-1a_en-768x768.jpg',
        'https://casadocelular.com.br/pub/media/catalog/product/cache/c1d4c962761cbca590e795c552c3321d/c/d/cdc-iphone-13-azul-camera-dupla-v1.jpg',
        'https://imgs.casasbahia.com.br/55048269/1g.jpg?imwidth=500',
        'https://novomundo.vteximg.com.br/arquivos/ids/25143783-500-500/16353669695954.jpg?v=637783060312570000',
        'https://images.kabum.com.br/produtos/fotos/239594/iphone-13-pro-max-128gb-dourado-5g-tela-de-6-7-camera-tripla-12mp-mll83bz-a_1633546239_g.jpg',
        'https://http2.mlstatic.com/D_NQ_NP_866128-MLA47778541963_102021-O.jpg'
      ]
    }
  }
}
</script>

<style>

</style>
