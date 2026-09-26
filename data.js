/* =========================================================
   data.js — ទិន្នន័យផលិតផល (Product Data)
   ========================================================= */

const CATEGORIES = [
  { id: "all",      label: "ទាំងអស់ / All" },
  { id: "chicken",  label: "មាន់បំពង" },
  { id: "burger",   label: "ប៊ឺហ្គឺ" },
  { id: "combo",    label: "ឈុតគ្រួសារ" },
  { id: "sides",    label: "ម្ហូបក្រៅ" },
  { id: "drinks",   label: "ភេសជ្ជៈ" },
  { id: "desserts", label: "បង្អែម" }
];

const PRODUCTS = [
  { id:"p01", name:"Crown Original 3 Pcs", kh:"មាន់បំពងរសជាតិដើម ៣ដុំ", category:"chicken", price:5.50, img:"images/chicken.svg",
    desc:"មាន់បំពងគ្រឿងទេស ១១ មុខ ស្រួយខាងក្រៅ ទន់ខាងក្នុង។", badge:"លក់ដាច់" },
  { id:"p02", name:"Spicy Crown 3 Pcs", kh:"មាន់បំពងហឹរ ៣ដុំ", category:"chicken", price:5.90, img:"images/chicken.svg",
    desc:"ម្រេចហឹរខ្មៅ និងម្ទេសក្រហម សម្រាប់អ្នកចូលចិត្តរសជាតិខ្លាំង។", badge:"ហឹរ" },
  { id:"p03", name:"Crispy Chicken Burger", kh:"ប៊ឺហ្គឺមាន់ស្រួយ", category:"burger", price:3.75, img:"images/burger.svg",
    desc:"មាន់បំពងស្រួយ ជាមួយសាឡាត់ និងទឹកជ្រលក់ម៉ាយ៉ូណែស។", badge:"" },
  { id:"p04", name:"Double Cheese Chicken Burger", kh:"ប៊ឺហ្គឺមាន់ឈីសទ្វេ", category:"burger", price:4.95, img:"images/burger.svg",
    desc:"មាន់បំពងពីរជាន់ ជាមួយឈីសឆេដដាររលាយ។", badge:"ថ្មី" },
  { id:"p05", name:"Family Feast Bucket", kh:"ឈុតគ្រួសារធំ", category:"combo", price:18.90, oldPrice:22.50, img:"images/bucket.svg",
    desc:"មាន់ ៨ដុំ + ដំឡូងបំពងធំ ២ + ភេសជ្ជៈ ៤។ សម្រាប់ ៤-៥នាក់។", badge:"សន្សំ 16%" },
  { id:"p06", name:"Duo Box", kh:"ឈុតពីរនាក់", category:"combo", price:9.90, oldPrice:11.40, img:"images/bucket.svg",
    desc:"មាន់ ៤ដុំ + ដំឡូងបំពង ២ + ភេសជ្ជៈ ២។", badge:"ឈុតសន្សំ" },
  { id:"p07", name:"Chicken Rice Box", kh:"បាយមាន់បំពង", category:"combo", price:4.50, img:"images/rice.svg",
    desc:"បាយក្ដៅ ជាមួយមាន់បំពង និងទឹកជ្រលក់ពិសេស។", badge:"" },
  { id:"p08", name:"Crown Wings 6 Pcs", kh:"ស្លាបមាន់ ៦ដុំ", category:"chicken", price:6.20, img:"images/wings.svg",
    desc:"ស្លាបមាន់ក្ដៅៗ ជ្រលក់ទឹកឃ្មុំ-ខ្ទឹមស។", badge:"លក់ដាច់" },
  { id:"p09", name:"Golden Fries (M)", kh:"ដំឡូងបំពងមធ្យម", category:"sides", price:1.90, img:"images/fries.svg",
    desc:"ដំឡូងបារាំងស្រួយ ប្រឡាក់អំបិលសមុទ្រ។", badge:"" },
  { id:"p10", name:"Golden Fries (L)", kh:"ដំឡូងបំពងធំ", category:"sides", price:2.60, img:"images/fries.svg",
    desc:"ទំហំធំសម្រាប់ចែករំលែក។", badge:"" },
  { id:"p11", name:"Popcorn Chicken", kh:"មាន់ប៉ុបខន", category:"sides", price:3.20, img:"images/nuggets.svg",
    desc:"មាន់ដុំតូចៗ ស្រួយ ញ៉ាំងាយ។", badge:"" },
  { id:"p12", name:"Creamy Coleslaw", kh:"សាឡាត់ស្ពៃក្ដោប", category:"sides", price:1.50, img:"images/salad.svg",
    desc:"ស្ពៃក្ដោបស្រស់ ច្របល់ទឹកជ្រលក់ក្រែម។", badge:"" },
  { id:"p13", name:"Iced Lemon Tea", kh:"តែក្រូចឆ្មាទឹកកក", category:"drinks", price:1.40, img:"images/drink.svg",
    desc:"តែស្រស់ ជាមួយក្រូចឆ្មា ត្រជាក់ស្រស់ស្រាយ។", badge:"" },
  { id:"p14", name:"Crown Cola (L)", kh:"កូឡាធំ", category:"drinks", price:1.50, img:"images/drink.svg",
    desc:"ភេសជ្ជៈមានឧស្ម័នត្រជាក់។", badge:"" },
  { id:"p15", name:"Choco Lava Cake", kh:"នំសូកូឡារលាយ", category:"desserts", price:2.80, img:"images/dessert.svg",
    desc:"នំសូកូឡាក្ដៅ ខាងក្នុងរលាយ។", badge:"ថ្មី" },
  { id:"p16", name:"Vanilla Sundae", kh:"ការ៉េមវ៉ានីឡា", category:"desserts", price:1.80, img:"images/dessert.svg",
    desc:"ការ៉េមទន់ ជាមួយទឹកស្ត្របឺរី។", badge:"" }
];

/* ID របស់ផលិតផលដែលបង្ហាញនៅទំព័រដើម (Featured) */
const FEATURED_IDS = ["p01", "p03", "p05", "p08", "p09", "p15"];

/* ការផ្តល់ជូនពិសេស (Deals) */
const DEALS = [
  { id:"d1", productId:"p05", title:"Family Feast ថ្ងៃអាទិត្យ", tag:"សន្សំ $3.60",
    text:"កម្មង់ឈុតគ្រួសារធំរៀងរាល់ថ្ងៃអាទិត្យ ទទួលបានតម្លៃពិសេស។" },
  { id:"d2", productId:"p06", title:"Duo Box សម្រាប់ពីរនាក់", tag:"សន្សំ $1.50",
    text:"ឈុតសមរម្យសម្រាប់ញ៉ាំជាមួយមិត្តភក្តិ ឬដៃគូ។" },
  { id:"d3", productId:"p03", title:"ប៊ឺហ្គឺ + ដំឡូង ពេលថ្ងៃត្រង់", tag:"11:00 – 14:00",
    text:"បញ្ជាទិញប៊ឺហ្គឺមាន់ស្រួយ ថែមដំឡូងបំពងតូច ក្នុងតម្លៃពិសេស។" }
];
