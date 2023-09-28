const { response } = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
dotenv.config({ path: ".env" });

const user = require("../models/userModel");
const author = require("../models/authorModel");
const book = require("../models/bookModel");
const genre = require("../models/genreModel");
const coupon = require("../models/couponModel");
const order = require("../models/orderModel");
const banner = require("../models/bannerModel");

const renderLogin = (req, res) => {
  try {
    const session = req.session.adminemail;
    if (session) {
      res.redirect("/admin/admin_panel");
    } else {
      const warning = req.session.adminError;
      req.session.adminError = false
      res.render("adminLogin.ejs",{warning});
    }
  } catch (err) {
    console.error(`Error Get Adimn Login Page : ${err}`);
    res.redirect("/");
  }
};

const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.adminEmail &&password == process.env.adminPassword) {
      req.session.adminemail = req.body.email;
      res.redirect("/admin/admin_panel");
    } else {
      req.session.adminError = "Email or Password Incorrect"
      res.redirect("/admin");
    }
  } catch (err) {
    console.error(`Error Admin Post Login : ${err}`);
    res.redirect("/admin");
  }
};

const adminPanel = async (req, res) => {
  try {
    const orders = await order.find();
    const totalOrder = await order.find().count();
    const completeOrder = await order.find({ status: "Complete" }).count();
    const pendingOrder = await order.find({ status: "Pending" }).count();
    const onTheWayOrder = await order.find({ status: "On The way" }).count();

    let totalRevenue = 0;
    for (let i = 0; i < orders.length; i++) {
      totalRevenue += orders[i].totalAmount;
    }

    res.render("admin.ejs", {
      totalOrder,
      completeOrder,
      pendingOrder,
      onTheWayOrder,
      totalRevenue,
    });
  } catch (err) {
    console.error(`Error Get Admin Panel : ${err}`);
    res.redirect("/admin");
  }
};

const renderUserManagement = async (req, res) => {
  try {
    const users = await user.find();
    res.render("admin/userManagement.ejs", { users });
  } catch (err) {
    console.error(`Error Get User Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const blockUser = async (req, res) => {
  try {
    await user.updateOne({ _id: req.params.id }, { $set: { block: false } });
    res.redirect("/admin/userManagement");
  } catch (err) {
    console.error(`Error Block User : ${err}`);
    res.redirect("/admin/userManagement");
  }
};

const unblockUser = async (req, res) => {
  try {
    await user.updateOne({ _id: req.params.id }, { $set: { block: true } });
    res.redirect("/admin/userManagement");
  } catch (err) {
    console.error(`Error Un Block User : ${err}`);
    res.redirect("/admin/userManagement");
  }
};

const renderProductManagement = async (req, res) => {
  try {
    const books = await book.find().populate("author").populate("genre");
    const authors = await author.find();
    const genres = await genre.find();

    res.render("admin/productManagement.ejs", { books, genres, authors });
  } catch (err) {
    console.error(`Error Get Product Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const renderAddBook = async (req, res) => {
  try {
    const warning = req.session.errormsg;
    req.session.errormsg = false;
    const authors = await author.find();
    const genres = await genre.find();
    res.render("admin/addBook.ejs", {
      title: "Add Book",
      warning,
      authors,
      genres,
    });
  } catch (err) {
    console.error(`Error Get Add Book : ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const addBook = async (req, res) => {
  try {
    const existingBookName = await book.findOne({
      bookName: req.body.bookName,
    });
    if (existingBookName) {
      req.session.errormsg = "Book Already Exit";
      return res.redirect("/admin/addBook");
    }

    const newBook = new book({
      bookName: req.body.bookName,
      bookDetails: req.body.bookDetails,
      author: req.body.author,
      genre: req.body.genre,
      language: req.body.language,
      image1: req.files[0].filename,
      image2: req.files[1].filename,
      image3: req.files[2].filename,
      rating: req.body.rating,
      pages: req.body.pages,
      retailPrice: req.body.retailPrice,
      rentPrice: req.body.rentPrice,
      delete: true,
    });
    newBook.save();
    res.redirect("/admin/productManagement");
  } catch (err) {
    console.error(`Error Add Book: ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const editBook = async (req, res) => {
  try {
    await book.updateOne(
      { _id: req.params.id },
      {
        $set: {
          bookName: req.body.bookName,
          bookDetails: req.body.bookDetails,
          author: req.body.author,
          genre: req.body.genre,
          language: req.body.language,
          rating: req.body.rating,
          pages: req.body.pages,
          retailPrice: req.body.retailPrice,
          rentPrice: req.body.rentPrice,
          delete: req.body.authorDelete,
        },
      }
    );
    res.redirect("/admin/productManagement");
  } catch (err) {
    console.error(`Error edit Book : ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const deleteBook = async (req, res) => {
  try {
    await book.updateOne({ _id: req.params.id }, { $set: { delete: false } });
    res.redirect("/admin/productManagement");
  } catch (err) {
    console.error(`Error Delete Book : ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const undeleteBook = async (req, res) => {
  try {
    await book.updateOne({ _id: req.params.id }, { $set: { delete: true } });
    res.redirect("/admin/productManagement");
  } catch (err) {
    console.error(`Error Un Delete Book : ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const addAuthorInAddBook = async (req, res) => {
  try {
    const existingAuthor = await author.findOne({
      authorName: req.body.authorName,
    });
    if (existingAuthor) {
      req.session.errormsg = "Author Already Exit";
      return res.redirect("/admin/addBook");
    }
    console.log(req.file.filename);

    const newAuthor = new author({
      authorName: req.body.authorName,
      authorDetails: req.body.authorDetails,
      authorImage: req.file.filename,
      delete: true,
    });
    await newAuthor.save();
    res.redirect("/admin/addBook");
  } catch (err) {
    console.error(`Error Add Book To Add Author Details : ${err}`);
    res.redirect("/admin/addBook");
  }
};

const addGenreInAddBook = async (req, res) => {
  try {
    const existingGenre = await genre.findOne({ genreName: req.body.genre });
    if (existingGenre) {
      req.session.errormsg = "Genre Already Exit";
      return res.redirect("/admin/addBook");
    }

    const newGenre = new genre({
      genreName: req.body.genre,
      delete: true,
    });
    await newGenre.save();
    res.redirect("/admin/addBook");
  } catch (err) {
    console.error(`Error Add Book To Add Genere : ${err}`);
    res.redirect("/admin/addBook");
  }
};

const coverImage = async (req, res) => {
  try {
    await book.updateOne(
      { _id: req.params.id },
      {
        $set: {
          coverImage: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.coverImage;
    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete Cover Image successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });
    res.redirect("/admin/productManagement");
  } catch (err) {
    console.error(`Error Change Image 1 : ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const changeImage1 = async (req, res) => {
  try {
    await book.updateOne(
      { _id: req.params.id },
      {
        $set: {
          image1: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.image1;
    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete Image 1 successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });
    res.redirect("/admin/productManagement");
  } catch (err) {
    console.error(`Error Change Image 1 : ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const changeImage2 = async (req, res) => {
  try {
    await book.updateOne(
      { _id: req.params.id },
      {
        $set: {
          image2: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.image2;

    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete Image 2 successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });

    res.redirect("/admin/productManagement");
  } catch (err) {
    console.error(`Error Change Image 2: ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const changeImage3 = async (req, res) => {
  try {
    await book.updateOne(
      { _id: req.params.id },
      {
        $set: {
          image3: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.image3;

    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete Image 3 successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });
    res.redirect("/admin/productManagement");
  } catch (err) {
    console.error(`Error Change Image 3 : ${err}`);
    res.redirect("/admin/productManagement");
  }
};

const renderAuthorManagement = async (req, res) => {
  try {
    const warning = req.session.errormsg;
    req.session.errormsg = false;
    const authors = await author.find();
    res.render("admin/authorManagement.ejs", { authors, warning });
  } catch (err) {
    console.error(`Error Get Author Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const addAuthor = async (req, res) => {
  try {
    const existingAuthor = await author.findOne({ authorName: req.body.authorName});
    if (existingAuthor) {
        req.session.errormsg = 'Author Already Exit';
        return res.redirect('/admin/authorManagement');
    }
    const newAuthor = new author({
      authorName: req.body.authorName,
      authorDetails: req.body.authorDetails,
      authorImage: req.file.filename,
      delete: true,
    });
    await newAuthor.save();

    res.redirect("/admin/authorManagement");
  } catch (err) {
    console.error(`Error Add Author : ${err}`);
    res.redirect("/admin/authorManagement");
  }
};

const editAuthor = async (req, res) => {
  try {
    await author.updateOne(
      { _id: req.params.id },
      {
        $set: {
          authorName: req.body.authorName,
          authorDetails: req.body.authorDetails,
          authorImage: req.body.authorFile,
          delete: req.body.authorDelete,
        },
      }
    );
    res.redirect("/admin/authorManagement");
  } catch (err) {
    console.error(`Error Edit Author : ${err}`);
    res.redirect("/admin/authorManagement");
  }
};

const changeAuthorImage = async (req, res) => {
  try {
    await author.updateOne(
      { _id: req.params.id },
      {
        $set: {
          authorName: req.body.authorName,
          authorDetails: req.body.authorDetails,
          authorImage: req.file.filename,
          delete: req.body.authorDelete,
        },
      }
    );

    const directoryPath = "public/" + req.body.authorFile;
    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete Author Image successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });
    res.redirect("/admin/authorManagement");
  } catch (err) {
    console.error(`Error Change Author Image : ${err}`);
    res.redirect("/admin/authorManagement");
  }
};

const deleteAuthor = async (req, res) => {
  try {
    await author.updateOne({ _id: req.params.id }, { $set: { delete: false } });
    res.redirect("/admin/authorManagement");
  } catch (err) {
    console.error(`Error Delete Author : ${err}`);
    res.redirect("/admin/authorManagement");
  }
};

const undeleteAuthor = async (req, res) => {
  try {
    await author.updateOne({ _id: req.params.id }, { $set: { delete: true } });
    res.redirect("/admin/authorManagement");
  } catch (err) {
    console.error(`Error Un Delete Author : ${err}`);
    res.redirect("/admin/authorManagement");
  }
};

const renderGenreManagement = async (req, res) => {
  try {
    const warning = req.session.errormsg;
    req.session.errormsg = false;
    const genres = await genre.find();
    res.render("admin/genreManagement.ejs", { genres, warning });
  } catch (err) {
    console.error(`Error Get Genre Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const addGenre = async (req, res) => {
  try {
    const existingGenre = await genre.findOne({ genreName: req.body.genre });
    if (existingGenre) {
      req.session.errormsg = "Genre Already Exit";
      return res.redirect("/admin/genreManagement");
    }

    const newGenre = new genre({
      genreName: req.body.genre,
      delete: true,
    });
    await newGenre.save();
    res.redirect("/admin/genreManagement");
  } catch (err) {
    console.error(`Error Add Genre : ${err}`);
    res.redirect("/admin/genreManagement");
  }
};

const editGenre = async (req, res) => {
  try {
    await genre.updateOne(
      { _id: req.params.id },
      {
        $set: {
          genreName: req.body.editGenreName,
          delete: req.body.genreDelete,
        },
      }
    );
    res.redirect("/admin/genreManagement");
  } catch (err) {
    console.error(`Error Edit Genre : ${err}`);
    res.redirect("/admin/genreManagement");
  }
};

const deleteGenre = async (req, res) => {
  try {
    await genre.updateOne({ _id: req.params.id }, { $set: { delete: false } });
    res.redirect("/admin/genreManagement");
  } catch (err) {
    console.error(`Error Delete Genre : ${err}`);
    res.redirect("/admin/genreManagement");
  }
};

const undeleteGenre = async (req, res) => {
  try {
    await genre.updateOne({ _id: req.params.id }, { $set: { delete: true } });
    res.redirect("/admin/genreManagement");
  } catch (err) {
    console.error(`Error Un Delete Genre : ${err}`);
    res.redirect("/admin/genreManagement");
  }
};

const renderCouponManagement = async (req, res) => {
  try {
    const warning = req.session.errormsg;
    req.session.errormsg = false;
    const coupons = await coupon.find();
    res.render("admin/couponManagement.ejs", { coupons, warning });
  } catch (err) {
    console.error(`Error Get Coupon Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const addCoupon = async (req, res) => {
  try {
    const existingCoupon = await coupon.findOne({
      couponName: req.body.couponName,
    });
    if (existingCoupon) {
      req.session.errormsg = "Coupon Already Exit";
      return res.redirect("/admin/couponManagement");
    }

    const newCoupon = new coupon({
      couponName: req.body.couponName,
      discountPercentage: req.body.discountPercentage,
      maximumDiscountPrice: req.body.maxDiscountPrice,
      minimumTotal: req.body.minTotalAmount,
      ExpiredDate: req.body.expDate,
    });
    await newCoupon.save();
    res.redirect("/admin/couponManagement");
  } catch (err) {
    console.error(`Error Add Genre : ${err}`);
    res.redirect("/admin/couponManagement");
  }
};

const editCoupon = async (req, res) => {
  try {
    const couponId = req.body.couponId;

    await coupon.updateOne(
      { _id: couponId },
      {
        $set: {
          couponName: req.body.couponName,
          discountPercentage: req.body.discountPercentage,
          maximumDiscountPrice: req.body.maximumDiscountPrice,
          minimumTotal: req.body.minimumTotal,
          ExpiredDate: req.body.expDate,
        },
      }
    );

    res.status(200).send(
      {
        data:"Success",
        couponName: req.body.couponName,
        discountPercentage: req.body.discountPercentage,
        maximumDiscountPrice: req.body.maximumDiscountPrice,
        minimumTotal: req.body.minTotalAmount,
        ExpiredDate: new Date(req.body.ExpiredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    })
  } catch (err) {
    console.error(`Error Edit Genre : ${err}`);
    res.redirect("/admin/couponManagement");
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.body.couponId;

    await coupon.deleteOne({ _id: couponId });

    res.status(200).send({ data: "success" });
  } catch (err) {
    console.error(`Error Edit Genre : ${err}`);
    res.redirect("/admin/couponManagement");
  }
};

// Order Management

const renderPendingManagement = async (req, res) => {
  try {
    const orders = await order
      .find({ status: "Pending" })
      .populate("user")
      .populate({
        path: "product.productId",
        model: "book",
        populate: [
          {
            path: "author",
            model: "author",
          },
          {
            path: "genre",
            model: "genre",
          },
        ],
      });
    res.render("admin/orderPendingManagment.ejs", { orders });
  } catch (err) {
    console.error(`Error Get Pending Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const changeOnTheWayOrder = async (req, res) => {
  try {
    await order.updateOne(
      { _id: req.params.id },
      { $set: { status: "On The Way" } }
    );
    res.status(200).send({ data: "Success" });
    // res.redirect('/admin/pendingManagement');
  } catch (err) {
    console.error(`Error change On The Way Order : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const renderOnTheWayManagement = async (req, res) => {
  try {
    const orders = await order
      .find({ status: "On The Way" })
      .populate("user")
      .populate({
        path: "product.productId",
        model: "book",
        populate: [
          {
            path: "author",
            model: "author",
          },
          {
            path: "genre",
            model: "genre",
          },
        ],
      });
    res.render("admin/orderOnTheWayManagment.ejs", { orders });
  } catch (err) {
    console.error(`Error Get Pending Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const changeCompleteOrder = async (req, res) => {
  try {
    await order.updateOne(
      { _id: req.params.id },
      { $set: { status: "Complete" } }
    );
    res.status(200).send({ data: "Success" });
    // res.redirect('/admin/onthewayManagement');
  } catch (err) {
    console.error(`Error change Complete Order : ${err}`);
    res.redirect("/admin/genreManagement");
  }
};

const renderCompleteManagement = async (req, res) => {
  try {
    const orders = await order
      .find({ status: "Complete" })
      .populate("user")
      .populate({
        path: "product.productId",
        model: "book",
        populate: [
          {
            path: "author",
            model: "author",
          },
          {
            path: "genre",
            model: "genre",
          },
        ],
      });
    res.render("admin/orderCompleteManagment.ejs", { orders });
  } catch (err) {
    console.error(`Error Get Complete Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const changeDeleteOrder = async (req, res) => {
  try {
    await order.updateOne(
      { _id: req.params.id },
      { $set: { status: "Delete" } }
    );
    res.status(200).send({ data: "Success" });
    // res.redirect('/admin/orderDeleteManagement');
  } catch (err) {
    console.error(`Error change Complete Order : ${err}`);
    res.redirect("/admin/genreManagement");
  }
};

const renderDeleteManagement = async (req, res) => {
  try {
    const orders = await order
      .find({ status: "Delete" })
      .populate("user")
      .populate({
        path: "product.productId",
        model: "book",
        populate: [
          {
            path: "author",
            model: "author",
          },
          {
            path: "genre",
            model: "genre",
          },
        ],
      });
    res.render("admin/orderDeleteManagment.ejs", { orders });
  } catch (err) {
    console.error(`Error Get Delete Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

// Banner Management

const renderBannerManagement = async (req, res) => {
  try {
    const books = await book.find().populate("author").populate("genre");
    const banners = await banner
      .findOne({ banner: true })
      .populate("bigCard1ProductId")
      .populate("bigCard2ProductId");
    const warning = req.session.errormsg;
    req.session.errormsg = false;
    res.render("admin/bannerManagement.ejs", { books, banners, warning });
  } catch (err) {
    console.error(`Error Get Banner Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const colorPalatte = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        colorPalatte: req.body.colorPalatte,
      });
      newBanner.save();
      return res
        .status(200)
        .send({ data: "success", colorPalatte: req.body.colorPalatte });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          colorPalatte: req.body.colorPalatte,
        },
      }
    );
    res
      .status(200)
      .send({ data: "success", colorPalatte: req.body.colorPalatte });
  } catch (err) {
    console.error(`Error Get colorPalatte Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const mainHeading = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        mainHeading: req.body.mainHeading,
      });
      newBanner.save();
      return res
        .status(200)
        .send({ data: "success", mainHeading: req.body.mainHeading });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          mainHeading: req.body.mainHeading,
        },
      }
    );
    res
      .status(200)
      .send({ data: "success", mainHeading: req.body.mainHeading });
  } catch (err) {
    console.error(`Error Get mainHeading Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const subHeading1 = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        subHeading1: req.body.subHeading1,
      });
      newBanner.save();
      return res
        .status(200)
        .send({ data: "success", subHeading1: req.body.subHeading1 });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          subHeading1: req.body.subHeading1,
        },
      }
    );
    res
      .status(200)
      .send({ data: "success", subHeading1: req.body.subHeading1 });
  } catch (err) {
    console.error(`Error Get subHeading1 Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const subHeading2 = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        subHeading2: req.body.subHeading2,
      });
      newBanner.save();
      return res
        .status(200)
        .send({ data: "success", subHeading2: req.body.subHeading2 });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          subHeading2: req.body.subHeading2,
        },
      }
    );
    res
      .status(200)
      .send({ data: "success", subHeading2: req.body.subHeading2 });
  } catch (err) {
    console.error(`Error Get subHeading2 Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const homeImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded!");
    }
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        homeImage: req.file.filename,
      });
      newBanner.save();
      res.redirect("/admin/bannerManagement");
      // return res.status(200).send({ data: "success", homeImage: req.file.filename });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          homeImage: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.oldHomeImage;
    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete Home Image successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });

    res.redirect("/admin/bannerManagement");
    //   res.status(200).send({ data: "success", homeImage: req.file.filename });
  } catch (err) {
    console.error(`Error Get homeImage Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard1Heading1 = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard1Heading1: req.body.bigCard1Heading1,
      });
      newBanner.save();
      return res
        .status(200)
        .send({ data: "success", bigCard1Heading1: req.body.bigCard1Heading1 });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard1Heading1: req.body.bigCard1Heading1,
        },
      }
    );
    res
      .status(200)
      .send({ data: "success", bigCard1Heading1: req.body.bigCard1Heading1 });
  } catch (err) {
    console.error(`Error Get bigCard1Heading1 Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard1Heading2 = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard1Heading2: req.body.bigCard1Heading2,
      });
      newBanner.save();
      return res
        .status(200)
        .send({ data: "success", bigCard1Heading2: req.body.bigCard1Heading2 });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard1Heading2: req.body.bigCard1Heading2,
        },
      }
    );
    res
      .status(200)
      .send({ data: "success", bigCard1Heading2: req.body.bigCard1Heading2 });
  } catch (err) {
    console.error(`Error Get bigCard1Heading2 Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard1Discription = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard1Discription: req.body.bigCard1Discription,
      });
      newBanner.save();
      return res
        .status(200)
        .send({
          data: "success",
          bigCard1Discription: req.body.bigCard1Discription,
        });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard1Discription: req.body.bigCard1Discription,
        },
      }
    );
    res
      .status(200)
      .send({
        data: "success",
        bigCard1Discription: req.body.bigCard1Discription,
      });
  } catch (err) {
    console.error(`Error Get bigCard1Discription Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard1ProductId = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard1ProductId: req.body.bigCard1ProductId,
      });
      newBanner.save();
      return res
        .status(200)
        .send({
          data: "success",
          bigCard1ProductId: req.body.bigCard1ProductId,
        });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard1ProductId: req.body.bigCard1ProductId,
        },
      }
    );
    const product = await banner
      .findOne({ banner: true })
      .populate("bigCard1ProductId");
    res.status(200).send({ data: "success", product });
  } catch (err) {
    console.error(`Error Get bigCard1ProductId Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard1Image = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded!");
    }
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard1Image: req.file.filename,
      });
      newBanner.save();
      res.redirect("/admin/bannerManagement");
      // return res.status(200).send({ data: "success", bigCard1Image: req.file.filename });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard1Image: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.oldBigCard1Image;
    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete Home Image successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });

    res.redirect("/admin/bannerManagement");
    //   res.status(200).send({ data: "success", bigCard1Image: req.file.filename });
  } catch (err) {
    console.error(`Error Get bigCard1Image Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard2Heading1 = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard2Heading1: req.body.bigCard2Heading1,
      });
      newBanner.save();
      return res
        .status(200)
        .send({ data: "success", bigCard2Heading1: req.body.bigCard2Heading1 });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard2Heading1: req.body.bigCard2Heading1,
        },
      }
    );
    res
      .status(200)
      .send({ data: "success", bigCard2Heading1: req.body.bigCard2Heading1 });
  } catch (err) {
    console.error(`Error Get bigCard2Heading1 Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard2Heading2 = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard2Heading2: req.body.bigCard2Heading2,
      });
      newBanner.save();
      return res
        .status(200)
        .send({ data: "success", bigCard2Heading2: req.body.bigCard2Heading2 });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard2Heading2: req.body.bigCard2Heading2,
        },
      }
    );
    res
      .status(200)
      .send({ data: "success", bigCard2Heading2: req.body.bigCard2Heading2 });
  } catch (err) {
    console.error(`Error Get bigCard2Heading2 Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard2Discription = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard2Discription: req.body.bigCard2Discription,
      });
      newBanner.save();
      return res
        .status(200)
        .send({
          data: "success",
          bigCard2Discription: req.body.bigCard2Discription,
        });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard2Discription: req.body.bigCard2Discription,
        },
      }
    );
    res
      .status(200)
      .send({
        data: "success",
        bigCard2Discription: req.body.bigCard2Discription,
      });
  } catch (err) {
    console.error(`Error Get bigCard2Discription Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard2ProductId = async (req, res) => {
  try {
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard2ProductId: req.body.bigCard2ProductId,
      });
      newBanner.save();
      return res
        .status(200)
        .send({
          data: "success",
          bigCard2ProductId: req.body.bigCard2ProductId,
        });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard2ProductId: req.body.bigCard2ProductId,
        },
      }
    );
    const product = await banner
      .findOne({ banner: true })
      .populate("bigCard2ProductId");
    res.status(200).send({ data: "success", product });
  } catch (err) {
    console.error(`Error Get bigCard2ProductId Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bigCard2Image = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded!");
    }
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bigCard2Image: req.file.filename,
      });
      newBanner.save();
      res.redirect("/admin/bannerManagement");
      // return res.status(200).send({ data: "success", bigCard2Image: req.file.filename });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bigCard2Image: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.oldBigCard2Image;
    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete Home Image successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });

    res.redirect("/admin/bannerManagement");
    //   res.status(200).send({ data: "success", bigCard2Image: req.file.filename });
  } catch (err) {
    console.error(`Error Get bigCard2Image Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bottomImage1 = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded!");
    }
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bottomImage1: req.file.filename,
      });
      newBanner.save();
      res.redirect("/admin/bannerManagement");
      // return res.status(200).send({ data: "success", homeImage: req.file.filename });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bottomImage1: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.oldBottomImage1;
    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
        console.log("Delete old Bottom Image 1 successfully.");
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });

    res.redirect("/admin/bannerManagement");
  } catch (err) {
    console.error(`Error Get bottomImage1 Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

const bottomImage2 = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded!");
    }
    const existingBanner = await banner.find().count();
    if (existingBanner == 0) {
      const newBanner = new banner({
        bottomImage2: req.file.filename,
      });
      newBanner.save();
      res.redirect("/admin/bannerManagement");
      // return res.status(200).send({ data: "success", homeImage: req.file.filename });
    }
    await banner.updateOne(
      { banner: true },
      {
        $set: {
          bottomImage2: req.file.filename,
        },
      }
    );

    const directoryPath = "public/" + req.body.oldBottomImage2;
    fs.unlink(directoryPath, (err) => {
      try {
        if (err) {
          throw err;
        }
      } catch (err) {
        console.error(`Error Deleting Book : ${err}`);
      }
    });

    res.redirect("/admin/bannerManagement");
  } catch (err) {
    console.error(`Error Get bottomImage2 Management : ${err}`);
    res.redirect("/admin/admin_panel");
  }
};

// Logout

const logout = (req, res) => {
  req.session.adminemail = null;
  res.redirect("/admin");
};

module.exports = {
  renderLogin,
  adminLogin,
  adminPanel,
  renderUserManagement,
  blockUser,
  unblockUser,
  renderProductManagement,
  addBook,
  editBook,
  deleteBook,
  undeleteBook,
  addAuthorInAddBook,
  addGenreInAddBook,
  coverImage,
  changeImage1,
  changeImage2,
  changeImage3,
  renderAddBook,
  renderAuthorManagement,
  addAuthor,
  editAuthor,
  changeAuthorImage,
  deleteAuthor,
  undeleteAuthor,
  renderGenreManagement,
  addGenre,
  editGenre,
  deleteGenre,
  undeleteGenre,
  renderCouponManagement,
  addCoupon,
  editCoupon,
  deleteCoupon,

  // order Management
  renderPendingManagement,
  changeOnTheWayOrder,
  renderOnTheWayManagement,
  changeCompleteOrder,
  renderCompleteManagement,
  changeDeleteOrder,
  renderDeleteManagement,

  // BannerMangement
  renderBannerManagement,
  colorPalatte,
  mainHeading,
  subHeading1,
  subHeading2,
  homeImage,

  bigCard1Heading1,
  bigCard1Heading2,
  bigCard1Discription,
  bigCard1ProductId,
  bigCard1Image,

  bigCard2Heading1,
  bigCard2Heading2,
  bigCard2Discription,
  bigCard2ProductId,
  bigCard2Image,

  bottomImage1,
  bottomImage2,

  logout,
};
