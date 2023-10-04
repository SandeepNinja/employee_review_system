const Employee = require("../models/employees");
const Review = require("../models/reviews");

module.exports.homePage = async function (req, res) {
  const myReview = req.user.myReview;
  const myData = await Review.find({
    _id: { $in: myReview },
  })
    .populate("reviewer_id")
    .populate("recipient_id");
  const PendingReview = req.user.pendingReview;
  const pendingData = await Review.find({
    _id: { $in: PendingReview },
  })
    .populate("reviewer_id")
    .populate("recipient_id");
  const oldReview = req.user.oldReview;
  const oldData = await Review.find({
    _id: { $in: oldReview },
  })
    .populate("reviewer_id")
    .populate("recipient_id");

  // console.log(pendingData);

  res.render("home", {
    myData: myData,
    pendingData: pendingData,
    oldData: oldData,
  });
};

module.exports.assign = async function (req, res) {
  let allEmployee = await Employee.find({});

  return res.render("assign", {
    Employee: allEmployee,
  });
};

module.exports.assign_review = async function (req, res) {
  console.log("Assign Review::", req.body);
  if (req.body.reviewer_id == req.body.recipient_id) {
    req.flash("error", "Both ids are same ");
    return res.redirect("back");
  }

  try {
    // create review in pending
    const ReviewerEmployee = await Employee.findById(req.body.reviewer_id);
    const RecipientEmployee = await Employee.findById(req.body.recipient_id);

    // chech already review assigned or not
    const checkReview = await Review.find({
      reviewer_id: req.body.reviewer_id,
      recipient_id: req.body.recipient_id,
    });
    // console.log("checkReview", checkReview);
    if (checkReview.length !== 0) {
      req.flash("error", "Review already Available");
      return res.redirect("back");
    }

    // creat new review between
    const createdReview = await Review.create({
      reviewer_id: req.body.reviewer_id,
      recipient_id: req.body.recipient_id,
    });
    console.log("createdReview", createdReview);
    ReviewerEmployee.pendingReview.push(createdReview._id);
    ReviewerEmployee.save();
    req.flash("success", "Successfully assigned");
  } catch (error) {
    console.log("Review2::", error);
    req.flash("error", "error in Assign review");
    return res.redirect("/");
  }
  return res.redirect("back");
};

module.exports.addContentInReview = async function (req, res) {
  console.log("data::", req.params.id, req.body);

  try {
    const newReviewWithCommnebt = await Review.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );

    const addReviewInRecipient = await Employee.findByIdAndUpdate(
      { _id: newReviewWithCommnebt.recipient_id._id },
      { $push: { myReview: newReviewWithCommnebt._id } }
    );
    const addReviewInReviewer = await Employee.findByIdAndUpdate(
      { _id: newReviewWithCommnebt.reviewer_id._id },
      { $push: { oldReview: newReviewWithCommnebt._id } }
    );
    const removeReviewInReviewer = await Employee.findByIdAndUpdate(
      { _id: newReviewWithCommnebt.reviewer_id._id },
      { $pull: { pendingReview: newReviewWithCommnebt._id } }
    );

    console.log("newReviewWithCommnet", newReviewWithCommnebt);
    req.flash("success", "Review updated successfully");
  } catch (error) {
    console.log("error", error);
    req.flash("error", "error while adding review");
  }

  return res.redirect("/");
};

module.exports.employee = async function (req, res) {
  try {
    const employees = await Employee.find({});
    // console.log("employees", employees);
    return res.render("employees", {
      employees: employees,
    });
  } catch (error) {
    console.log("error::", error);
    return res.render("back");
  }
};

module.exports.updateEmployee = async function (req, res) {
  console.log("updateEmployee::", req.params.id, " :: ", req.body);

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    // console.log("updatedEmployee::", updatedEmployee);
  } catch (error) {
    console.log("error::", error);
    req.flash("error", "error while updating");
  }

  return res.redirect("back");
};

module.exports.deleteEmployee = async function (req, res) {
  if (req.user.id == req.params.id) {
    req.flash("You cann't delete your own id");
    return res.redirect("/");
  }

  console.log("I am working", req.params.id, "ffff", req.user.id);
  try {
    const employee = await Employee.findById({ _id: req.params.id });
    // console.log("employee delete", employee);

    // pendingReview delete -----------------
    // console.log("***employee.pendingReview", employee.pendingReview);
    const pendingReviewArray = employee.pendingReview;

    pendingReviewArray.forEach(async (pendingIds) => {
      await Review.findByIdAndDelete({ _id: pendingIds });
      // console.log("pendingReview", pendingIds);
    });

    // myReview delete ----------------------
    // console.log("***employee.myReview", employee.myReview);

    await employee.myReview.forEach(async (reviewId) => {
      const detailedMyreview = await Review.findById({ _id: reviewId });
      // console.log("detailedMyreview::", detailedMyreview);
      if (detailedMyreview) {
        await Employee.findByIdAndUpdate(
          { _id: detailedMyreview.reviewer_id },
          { $pull: { oldReview: reviewId } }
        );
      }
      await Review.findByIdAndDelete({ _id: reviewId });
      // console.log("myreview deleted", reviewId);
    });

    //oldReview delete --------------------------
    // console.log("***employee.oldReview", employee.oldReview);
    await employee.oldReview.forEach(async (reviewId) => {
      const detailedMyreview = await Review.findById({ _id: reviewId });
      if (detailedMyreview) {
        const oldReviewewData = await Employee.findByIdAndUpdate(
          { _id: detailedMyreview.recipient_id },
          { $pull: { myReview: reviewId } }
        );
        // console.log("***oldReviewewData", oldReviewewData);
      }
      await Review.findByIdAndDelete({ _id: detailedMyreview._id });
      // console.log("oldreview deleted", reviewId);
    });

    // find and delete from all reviews of reviewer whos recipient is this id
    await Review.deleteMany({ recipient_id: req.params.id });

    // deleter employee finally
    await Employee.findByIdAndDelete({ _id: req.params.id });

    req.flash("success", "Employee deleted successfully");
    return res.redirect("back");
  } catch (error) {
    console.log("error in deleting", error);
    req.flash("error", "error in deleting");

    return res.redirect("back");
  }
};
