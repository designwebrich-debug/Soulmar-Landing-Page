# Snippet de Botón de WhatsApp para WordPress / CMS

Este snippet proporciona el código HTML, CSS y la lógica de visibilidad para ser usado en plataformas como WordPress (Divi, Elementor, o código personalizado).

## 1. Código PHP (para functions.php)

Copia y pega este código en el archivo `functions.php` de tu tema hijo para que el botón solo aparezca en las páginas solicitadas.

```php
function soulmar_whatsapp_button() {
    // IDs o Slugs de las páginas: Inicio, Soulmar Camp, Tienda
    if ( is_front_page() || is_page( array( 'soulmar-camp', 'tienda', 'shop' ) ) ) {
        ?>
        <a href="https://api.whatsapp.com/send?phone=573024594428&text=Hola%20%F0%9F%8C%BF%E2%9C%A8%20estoy%20dando%20este%20paso%20porque%20quiero%20empezar%20a%20sentirme%20mejor%20conmigo%20%F0%9F%92%9B%20Me%20encantar%C3%ADa%20que%20me%20orientaran%20un%20poco%20sobre%20c%C3%B3mo%20Soulmar%20puede%20acompa%C3%B1arme%20en%20este%20proceso%20%F0%9F%92%99" 
           target="_blank" 
           id="whatsapp-floating-btn" 
           class="soulmar-wpp-btn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.618-.915-2.207-.238-.573-.48-.495-.67-.504-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
        </a>
        <style>
            .soulmar-wpp-btn {
                position: fixed;
                bottom: 25px;
                right: 25px;
                width: 60px;
                height: 60px;
                background-color: #25D366;
                color: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                z-index: 9999;
                transition: all 0.3s ease;
                text-decoration: none;
            }
            .soulmar-wpp-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 15px rgba(0,0,0,0.4);
            }
            .soulmar-wpp-btn svg {
                width: 35px;
                height: 35px;
            }
            @media (max-width: 768px) {
                .soulmar-wpp-btn {
                    bottom: 20px;
                    right: 20px;
                    width: 55px;
                    height: 55px;
                }
            }
        </style>
        <?php
    }
}
add_action( 'wp_footer', 'soulmar_whatsapp_button' );
```

## 2. Instrucciones para Divi/Elementor

Si prefieres usar un módulo de **Código** en lugar de `functions.php`:

1.  Crea un módulo de código global o agrégalo en el Footer.
2.  Pega el contenido entre `<style>` y el bloque `<a>`.
3.  Usa la configuración de "Visibilidad" del constructor para mostrarlo solo en las páginas deseadas.
