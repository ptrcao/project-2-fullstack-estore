const { ProductCategoryGender } = require("./models");
const { ProductCategory } = require("./models");
const { Product } = require("./models");

const path = require("path");
const express = require("express");
const router = require("express").Router();
// Import the connection object
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const app = express();
// const routes = require('./controllers')
const routes = require('./routes');

const sequelize = require("./config/connection");
app.use(
  session({
    secret: process.env.COOKIE_SECRET || "secret",
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30, // 30 minutes
      sameSite: "strict",
      secure: false,
    },
  })
);

const PORT = 3001;

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.use("/api/cart", require("./routes/api/cartRoutes"));
app.set("view engine", "ejs");

// Check that both app.set and router.set are needed

// const { getProductCategoryGenderData } = require('./controllers/productCategoryGenderController');

// router.get('/', async (req, res) => {
//   try {
//     const categoriesByGender = await getProductCategoryGenderData();
//     res.render('home', { categoriesByGender });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });
// app.use(routes);

// const checkoutRoutes = require('./routes/api/checkoutRoutes');

// app.use(
// '/checkout'
// )

// Expose the public_html folder to the client-side
app.use(express.static("public_html"));
app.use(routes);
// /product/:id
// /product_categories/
// pro

// const { getProductCategoryGenderData } = require('./controllers/productCategoryGenderController');

// router.get('/', async (req, res) => {
//   try {
//     const categoriesByGender = await getProductCategoryGenderData();
//     res.render('home', { categoriesByGender });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

// const checkoutRoutes = require('./routes/api/checkoutRoutes');

// needed to serve font awesome
const serveStatic = require("serve-static");

app.use("/static", serveStatic(__dirname + "/node_modules"));

async function getArrayForDeptAndCatMegaMenu() {
  const productCategories = await ProductCategoryGender.findAll({
    include: [
      {
        model: ProductCategory,
        as: "product_categories",
      },
    ],
  });

  return productCategories;
}

app.get("/", async (req, res) => {
  // res.sendFile(path.join(__dirname + '/views/home.html'))

  // for navbar
const megaMenuArray = await getArrayForDeptAndCatMegaMenu();

  const getGenderDepartments = async () => {
    const productCategoryGenderData = await ProductCategoryGender.findAll({
      // include: [{
      //   model: ProductCategory,
      //   attributes: ['product_category_name', 'product_category_image', 'id'],
      // }],
      raw: true, // Set raw to true to get only the data
    });

    console.log(productCategoryGenderData);
    return productCategoryGenderData;
  };

  const data = await getGenderDepartments();
  // res.json( data )
  res.render("home", { data, megaMenuArray });
});

app.get("/product-categories/:id", async (req, res) => {
  // res.sendFile(path.join(__dirname + '/views/home.html'))

  // for navbar
  const megaMenuArray = await getArrayForDeptAndCatMegaMenu();

  const genderDepartmentId = req.params.id; // get the body of the req object

  const getProductCategories = async () => {
    const productCategoriesData = await ProductCategory.findAll({
      where: {
        product_category_gender_id: genderDepartmentId, // specify the condition for the 'id' column
      },
      raw: true, // Set raw to true to get only the data
    });

    // console.log(productCategoriesData);
    return productCategoriesData;
  };

  const productCategoryGenderName = await ProductCategoryGender.findAll({
    where: {
      id: genderDepartmentId, // replace 3 with the desired id value
    },
    attributes: ["product_category_gender_name"], // select only the 'name' attribute
    raw: true, // Set raw to true to get only the data
  });

  const data2 = await getProductCategories();
  console.log("hello " + JSON.stringify(data2));

  // Append data2 with genderDepartmentId
  // data2.push(productCategoryGenderName)

  data2.push(productCategoryGenderName[0].product_category_gender_name);

  console.log(data2);
  // res.json( body.id )
  // console.log( req.body )
  // res.json( data2 )

  res.render(`product-categories`, { data2, megaMenuArray });

  // res.redirect(`/product-category/${req.body}`);
});

app.get("/product-category/:id", async (req, res) => {
  // res.sendFile(path.join(__dirname + '/views/home.html'))

  // for navbar
  const megaMenuArray = await getArrayForDeptAndCatMegaMenu();

  const productCategoryId = req.params.id;
  console.log(productCategoryId);

  const getProductCategory = async () => {
    const productCategoryData = await Product.findAll({
      where: {
        product_category_id: req.params.id, // specify the condition for the 'id' column
      },
      raw: true, // Set raw to true to get only the data
    });

    console.log(productCategoryData);
    return productCategoryData;
  };

  const data3 = await getProductCategory();

  const productCategoryName = await ProductCategory.findAll({
    where: {
      id: productCategoryId, // replace 3 with the desired id value
    },
    attributes: ["product_category_name"], // select only the 'name' attribute
    raw: true, // Set raw to true to get only the data
  });

  data3.push(productCategoryName[0].product_category_name);

  // res.json( data )
  res.render("product-category", { data3, megaMenuArray });
});

app.get("/product/:id", async (req, res) => {
  // res.sendFile(path.join(__dirname + '/views/home.html'))

  // for navbar
  const megaMenuArray = await getArrayForDeptAndCatMegaMenu();

  const productId = req.params.id;
  console.log(productId);

  const getProductCategory = async () => {
    const productData = await Product.findAll({
      where: {
        id: productId, // specify the condition for the 'id' column
      },
      raw: true, // Set raw to true to get only the data
    });

    console.log(productData);
    return productData;
  };

  const data4 = await getProductCategory();



  // res.json( data )
  res.render("product", { data4, megaMenuArray });
});

app.get("/cart", async (req, res) => {
  const megaMenuArray = await getArrayForDeptAndCatMegaMenu();
  res.render("cart", {megaMenuArray});
});

const { insertOrder } = require("./controllers/queries");

app.get("/checkout", (req, res) => {
  res.sendFile(__dirname + "/public_html/checkout.html");
});

// // CHECKOUT BUTTON --> INSERT NEW ORDER, CUSTOMER DETAILS, PRODUCT DETAILS
// app.post("/api/checkout", (req, res) => {
//   const cart = req.session?.cart;
//   if (!cart) {
//     res.status(400).json({ error: "No cart" });
//     return;
//   }
//   // All items in the cart and their quantities
//   const cartItems = req.session.cart.items.map((item) => {
//     return { id: item.id, qty: item.amount };
//   });

//   const body = req.body;
//   console.log(body);
//   insertOrder(body, cartItems);
//   res.redirect("/thank-you/:order-id");
// });

const thankYouRoute = require("./routes/thankYouRoute");
app.use("/thank-you", thankYouRoute);


// app.get("/thankyou/:id", async (req, res) => {

//   const orderId = req.params['order-id'];

// // Sequelize Query
// // findAll shipping_address_id, billing_address_id, customer_id

// const orderForeignKeys = await Order.findOne({
//     where: { id: orderId },
//     // attributes: ['firstName', 'lastName']
//     raw: true
//   }
//   );
//   console.log(orderId)
// //   res.json(orderForeignKeys)
//   console.log(orderForeignKeys)
// //   res.render("thank-you", {});
// res.send("Hello")
// // res.sendFile('../views/thank-you.ejs')
// });

// app.get('/p/:id',function(req,res){
//   res.send('Id is ' + req.params.id)
// })

// Connect to the database before starting the Express.js server
sequelize.sync({force : false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});


// let megaMenuArray; 

// async function getMegaMenuData() {
//   megaMenuArray = await getArrayForDeptAndCatMegaMenu();
// }

// getMegaMenuData();


// module.exports = { megaMenuArray };