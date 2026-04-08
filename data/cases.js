// Good cases for Materials AI — declare-render schemas.
// Add new cases as additional keys on window.GOOD_CASES.
// To render a case live, see the <script type="module"> block at the bottom of index.html.
window.GOOD_CASES = {
  "floral-spring": {
    "id": "floral-spring-poster",
    "width": 1080,
    "height": 1920,
    "layers": [
      {
        "id": "background",
        "type": "img",
        "url": "https://ydslvpkmzewllklptvkq.supabase.co/storage/v1/object/public/materials-images/images/1775664655221-8mz3y2.jpeg",
        "objectFit": "cover",
        "x": 0,
        "y": 0,
        "width": 1080,
        "height": 1920
      },
      {
        "id": "brandName",
        "type": "text",
        "content": "TL-ZHUO 卓",
        "x": 0,
        "y": 430,
        "width": 1080,
        "height": 70,
        "style": {
          "fontName": "Playfair Display",
          "fontSize": 44,
          "color": "#1a1a1a",
          "fontWeight": "normal",
          "align": "center"
        }
      },
      {
        "id": "chineseText",
        "type": "text",
        "content": "春启万象",
        "x": 440,
        "y": 640,
        "width": 200,
        "height": 1200,
        "style": {
          "fontName": "BiauKaiTC-Regular",
          "fontSize": 180,
          "color": "#1a1a1a",
          "fontWeight": "normal",
          "align": "center",
          "verticalAlign": "top",
          "verticalGap": 40
        }
      }
    ]
  },
  "coffee-shop": {
    "id": "coffee-shop-poster",
    "width": 1080,
    "height": 1920,
    "layers": [
      {
        "id": "background",
        "type": "img",
        "url": "https://ydslvpkmzewllklptvkq.supabase.co/storage/v1/object/public/materials-images/images/1775527630163-o24kft.jpeg",
        "objectFit": "cover",
        "x": 0,
        "y": 0,
        "width": 1080,
        "height": 1920
      },
      {
        "id": "shop-name",
        "type": "text",
        "content": "THE COFFEE CO.",
        "x": 0,
        "y": 320,
        "width": 1080,
        "height": 80,
        "style": {
          "fontName": "Montserrat",
          "fontSize": 64,
          "color": "#FFF8E1",
          "fontWeight": "bold",
          "align": "center"
        }
      },
      {
        "id": "headline",
        "type": "text",
        "content": "Artisan Coffee",
        "x": 0,
        "y": 420,
        "width": 1080,
        "height": 70,
        "style": {
          "fontName": "Montserrat",
          "fontSize": 48,
          "color": "#FFF8E1",
          "align": "center"
        }
      },
      {
        "id": "divider",
        "type": "shape",
        "x": 0,
        "y": 0,
        "width": 1080,
        "height": 1920,
        "shapes": [
          {
            "type": "rect",
            "x": 340,
            "y": 520,
            "width": 400,
            "height": 2,
            "style": {
              "fillStyle": "#D4A574"
            }
          }
        ]
      },
      {
        "id": "cta",
        "type": "text",
        "content": "Visit Us Today",
        "x": 0,
        "y": 1780,
        "width": 1080,
        "height": 40,
        "style": {
          "fontName": "Montserrat",
          "fontSize": 28,
          "color": "#FF8F00",
          "fontWeight": "bold",
          "align": "center"
        }
      }
    ]
  },
  "rosvine-poster": {
    "id": "rosvine-poster",
    "width": 1080,
    "height": 1920,
    "layers": [
      {
        "id": "bg-white",
        "type": "shape",
        "x": 0,
        "y": 0,
        "shapes": [
          {
            "type": "fillRect",
            "x": 0,
            "y": 0,
            "width": 1080,
            "height": 1920,
            "style": {
              "fillStyle": "#FAFAFA"
            }
          }
        ]
      },
      {
        "id": "headline-bg",
        "type": "shape",
        "x": 0,
        "y": 0,
        "shapes": [
          {
            "type": "fillRect",
            "x": 280,
            "y": 180,
            "width": 520,
            "height": 320,
            "rx": 20,
            "ry": 20,
            "style": {
              "fillStyle": "#E8503A"
            }
          }
        ]
      },
      {
        "id": "headline-text",
        "type": "text",
        "x": 280,
        "y": 200,
        "width": 520,
        "height": 130,
        "content": "今日营业中",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 72,
          "color": "#ffffff",
          "fontWeight": "bold",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "headline-divider",
        "type": "shape",
        "x": 0,
        "y": 0,
        "shapes": [
          {
            "type": "fillRect",
            "x": 480,
            "y": 352,
            "width": 120,
            "height": 2,
            "style": {
              "fillStyle": "#ffffff"
            }
          }
        ]
      },
      {
        "id": "hours-text",
        "type": "text",
        "x": 280,
        "y": 378,
        "width": 520,
        "height": 90,
        "content": "AM 10:00 — PM 10:00",
        "style": {
          "fontName": "Montserrat",
          "fontSize": 34,
          "color": "#ffffff",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "service-1",
        "type": "text",
        "x": 0,
        "y": 640,
        "width": 1080,
        "height": 60,
        "content": "问路请随时咨询",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 40,
          "color": "#2b2b2b",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "service-2",
        "type": "text",
        "x": 0,
        "y": 730,
        "width": 1080,
        "height": 60,
        "content": "喝茶休息区",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 40,
          "color": "#2b2b2b",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "service-3",
        "type": "text",
        "x": 0,
        "y": 820,
        "width": 1080,
        "height": 60,
        "content": "免费热水",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 40,
          "color": "#2b2b2b",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "service-4",
        "type": "text",
        "x": 0,
        "y": 910,
        "width": 1080,
        "height": 60,
        "content": "医用口罩",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 40,
          "color": "#2b2b2b",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "service-5",
        "type": "text",
        "x": 0,
        "y": 1000,
        "width": 1080,
        "height": 60,
        "content": "应急物资",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 40,
          "color": "#2b2b2b",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "service-6",
        "type": "text",
        "x": 0,
        "y": 1090,
        "width": 1080,
        "height": 60,
        "content": "手机充电",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 40,
          "color": "#2b2b2b",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "service-7",
        "type": "text",
        "x": 0,
        "y": 1180,
        "width": 1080,
        "height": 60,
        "content": "WiFi 无线",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 40,
          "color": "#2b2b2b",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "service-8",
        "type": "text",
        "x": 0,
        "y": 1270,
        "width": 1080,
        "height": 60,
        "content": "微笑服务",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 40,
          "color": "#2b2b2b",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "footer-divider",
        "type": "shape",
        "x": 0,
        "y": 0,
        "shapes": [
          {
            "type": "fillRect",
            "x": 500,
            "y": 1470,
            "width": 80,
            "height": 2,
            "style": {
              "fillStyle": "#E8503A"
            }
          }
        ]
      },
      {
        "id": "logo-rosvine",
        "type": "text",
        "x": 0,
        "y": 1520,
        "width": 1080,
        "height": 110,
        "content": "Rosvine",
        "style": {
          "fontName": "Dancing Script",
          "fontSize": 88,
          "color": "#E8503A",
          "align": "center",
          "verticalAlign": "center"
        }
      },
      {
        "id": "logo-subtitle",
        "type": "text",
        "x": 0,
        "y": 1650,
        "width": 1080,
        "height": 50,
        "content": "— 玫瑰藤蔓 —",
        "style": {
          "fontName": "PingFang SC",
          "fontSize": 28,
          "color": "#666666",
          "align": "center",
          "verticalAlign": "center"
        }
      }
    ]
  },
  "manner-coffee-poster-v2": {
    "id": "manner-coffee-poster-v2",
    "width": 1080,
    "height": 1920,
    "layers": [
      {
        "id": "background",
        "type": "shape",
        "x": 0,
        "y": 0,
        "shapes": [
          {
            "type": "rect",
            "x": 0,
            "y": 0,
            "width": 1080,
            "height": 1920,
            "style": {
              "fillStyle": "#F8F4EA"
            }
          }
        ]
      },
      {
        "id": "brand-name",
        "type": "text",
        "x": 0,
        "y": 110,
        "width": 1080,
        "height": 100,
        "content": "MANNER COFFEE",
        "style": {
          "fontName": "Montserrat",
          "fontSize": 80,
          "fontWeight": "700",
          "color": "#1C1C1C",
          "align": "center"
        }
      },
      {
        "id": "subtitle",
        "type": "text",
        "x": 0,
        "y": 220,
        "width": 1080,
        "height": 48,
        "content": "SPECIALTY COFFEE . FRESH DAILY",
        "style": {
          "fontName": "Montserrat",
          "fontSize": 26,
          "fontWeight": "500",
          "color": "#5A544B",
          "align": "center"
        }
      },
      {
        "id": "hours-badge",
        "type": "shape",
        "x": 180,
        "y": 305,
        "shapes": [
          {
            "type": "rect",
            "x": 0,
            "y": 0,
            "width": 720,
            "height": 78,
            "rx": 12,
            "ry": 12,
            "style": {
              "fillStyle": "#F8F4EA",
              "strokeStyle": "#8B8479",
              "lineWidth": 2,
              "lineDash": [
                10,
                6
              ]
            }
          }
        ]
      },
      {
        "id": "hours-text",
        "type": "text",
        "x": 0,
        "y": 328,
        "width": 1080,
        "height": 36,
        "content": "营业时间 06:30 - 21:30",
        "style": {
          "fontName": "Noto Sans SC",
          "fontSize": 30,
          "fontWeight": "500",
          "color": "#3D3933",
          "align": "center"
        }
      },
      {
        "id": "hero-latte",
        "type": "img",
        "x": 180,
        "y": 500,
        "width": 720,
        "height": 860,
        "url": "https://ydslvpkmzewllklptvkq.supabase.co/storage/v1/object/public/materials-images/images/1775668790189-7y28kb.jpeg",
        "objectFit": "cover",
        "radius": 8
      },
      {
        "id": "cta-title",
        "type": "text",
        "x": 0,
        "y": 1450,
        "width": 1080,
        "height": 58,
        "content": "SCAN FOR MENU & MEMBERSHIP",
        "style": {
          "fontName": "Montserrat",
          "fontSize": 34,
          "fontWeight": "700",
          "color": "#222222",
          "align": "center"
        }
      },
      {
        "id": "qr-placeholder",
        "type": "img",
        "x": 300,
        "y": 1590,
        "url": "data:image/png;base64,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",
        "width": 140,
        "height": 140
      },
      {
        "id": "social-handle",
        "type": "text",
        "x": 480,
        "y": 1650,
        "width": 300,
        "height": 34,
        "content": "@MANNERCOFFEE",
        "style": {
          "fontName": "Montserrat",
          "fontSize": 24,
          "fontWeight": "500",
          "color": "#5A544B"
        }
      },
      {
        "id": "qr-caption",
        "type": "text",
        "x": 480,
        "y": 1612,
        "width": 300,
        "height": 30,
        "content": "Scan to order online",
        "style": {
          "fontName": "Montserrat",
          "fontSize": 22,
          "fontWeight": "500",
          "color": "#3D3933"
        }
      },
      {
        "id": "store-address",
        "type": "text",
        "x": 0,
        "y": 1800,
        "width": 1080,
        "height": 34,
        "content": "上海市静安区南京西路1699号",
        "style": {
          "fontName": "Noto Sans SC",
          "fontSize": 22,
          "color": "#6A645B",
          "align": "center"
        }
      }
    ]
  }
};
