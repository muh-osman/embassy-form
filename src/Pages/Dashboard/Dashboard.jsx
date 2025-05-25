import style from "./Dashboard.module.scss";
// React
import { useEffect, useState, useRef } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Fab from "@mui/material/Fab";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Divider } from "@mui/material";
// Cookies
import { useCookies } from "react-cookie";
// Toastify
// import { toast } from "react-toastify";
// API
import { useEditUserApi } from "../../API/useEditUserApi";
// Image
import logo from "../../Assets/Images/logo.png";

export default function Dashboard() {
  // Cookie
  const [cookies, setCookie] = useCookies([
    "token",
    "verified",
    "membershipNumber",
    "role",
    "isUserSentDataBefore",
  ]);
  const formRef = useRef();
  const { mutate, data, isPending, isSuccess } = useEditUserApi();
  // State for form fields
  const [formData, setFormData] = useState({
    name_arabic: "",
    name_english: "",
    gender: "",
    area: "",
    city: "",
    neighborhood: "",
    profession: "",
    currently_working: "",
    status: "",
    family_living_with_you: "",
    number_of_family_members: "",
    mobile_number: "",
    alternative_mobile_number: "",
    note: "",
  });

  // State for family members
  const [familyMembers, setFamilyMembers] = useState([]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle checkbox/select values correctly
    const val = type === "checkbox" ? e.target.checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  // Handle family member input changes
  const handleFamilyMemberChange = (index, field, value) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    setFamilyMembers(updatedMembers);
  };

  // Update family members when number_of_family_members changes
  useEffect(() => {
    const numMembers = parseInt(formData.number_of_family_members) || 0;

    if (numMembers > 0) {
      // Initialize or adjust family members array
      const newMembers = [];
      for (let i = 0; i < numMembers; i++) {
        newMembers.push(
          familyMembers[i] || {
            name_arabic: "",
            name_english: "",
          }
        );
      }
      setFamilyMembers(newMembers);
    } else {
      setFamilyMembers([]);
    }
  }, [formData.number_of_family_members]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validate = formRef.current.reportValidity();
    if (!validate) return;

    // Create FormData object
    const formDataToSend = new FormData();

    // Append all regular form fields
    Object.entries(formData).forEach(([key, value]) => {
      // Convert boolean values to strings (for FormData compatibility)
      if (typeof value === "boolean") {
        formDataToSend.append(key, value ? "1" : "0");
      } else if (value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    // Append family members data
    familyMembers.forEach((member, index) => {
      formDataToSend.append(
        `family_members[${index}][name_arabic]`,
        member.name_arabic || ""
      );
      formDataToSend.append(
        `family_members[${index}][name_english]`,
        member.name_english || ""
      );
    });

    mutate(formDataToSend);

    // For debugging - view all form data being sent
    // for (const [key, value] of formDataToSend.entries()) {
    //   console.log(key, value);
    // }

    // Determine if we're creating or updating
    // const isUpdate = !!userData?.id; // Assuming you have userData in state if editing

    // Call appropriate mutation
    // if (isUpdate) {
    //   // For update - typically PUT/PATCH request
    //   updateUserMutation(formDataToSend);
    // } else {
    //   // For create - typically POST request
    //   createUserMutation(formDataToSend);
    // }
  };

  return (
    <div className={style.container}>
      {/* {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )} */}

      <div
        style={{
          margin: "auto",
          marginBottom: "18px",
          width: "100px",
          height: "100px",
        }}
      >
        <img style={{ width: "100%" }} src={logo} alt="logo" />
      </div>
      <h3 style={{ textAlign: "center" }}>الجالية السودانية بمنطقة عسير</h3>

      {isSuccess || cookies.isUserSentDataBefore ? (
        <>
          <h1 style={{ textAlign: "center", marginTop: "32px" }}>
            شكرا, تم ارسال البيانات
          </h1>
          <h3 dir="rtl" style={{ textAlign: "center", marginTop: "18px" }}>
            رقم العضوية: {cookies.membershipNumber}
          </h3>
        </>
      ) : (
        <Box
          className={style.box}
          ref={formRef}
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            {/* الاسم بالعربي */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
                label="الاسم الكامل بالعربي"
                type="text"
                name="name_arabic"
                value={formData.name_arabic}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
              />
            </Grid>
            {/* الاسم بالانكليزي */}
            <Grid item xs={12}>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
                label="الاسم الكامل بالإنكليزي (اختياري)"
                type="text"
                name="name_english"
                value={formData.name_english}
                onChange={handleChange}
                disabled={isPending}
                helperText="اكتب الاسم كما هو في جواز السفر"
                FormHelperTextProps={{
                  sx: {
                    textAlign: "right", // For RTL languages
                    marginRight: 0, // Adjust as needed
                  },
                }}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
              />
            </Grid>
            {/* الجنس */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    flexDirection: "row-reverse", // Reverse the input and icon
                  },
                  "& .MuiSelect-icon": {
                    left: 14, // Adjust icon position
                    right: "auto", // Override default right position
                  },
                  "& .MuiOutlinedInput-input": {
                    textAlign: "right", // Keep text right-aligned
                    paddingRight: "14px !important", // Add space for the icon
                  },
                }}
                fullWidth
                label="الجنس"
                select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
                SelectProps={{
                  MenuProps: {
                    dir: "rtl", // RTL for dropdown menu
                  },
                }}
                inputProps={{
                  dir: "rtl", // RTL for input text
                }}
              >
                <MenuItem value="ذكر">ذكر</MenuItem>
                <MenuItem value="انثى">انثى</MenuItem>
              </TextField>
            </Grid>
            {/* المنطقة */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    flexDirection: "row-reverse", // Reverse the input and icon
                  },
                  "& .MuiSelect-icon": {
                    left: 14, // Adjust icon position
                    right: "auto", // Override default right position
                  },
                  "& .MuiOutlinedInput-input": {
                    textAlign: "right", // Keep text right-aligned
                    paddingRight: "14px !important", // Add space for the icon
                  },
                }}
                fullWidth
                label="المنطقة"
                select
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
                SelectProps={{
                  MenuProps: {
                    dir: "rtl", // RTL for dropdown menu
                  },
                }}
                inputProps={{
                  dir: "rtl", // RTL for input text
                }}
              >
                <MenuItem value="الرياض">الرياض</MenuItem>
                <MenuItem value="مكة المكرمة">مكة المكرمة</MenuItem>
                <MenuItem value="المدينة المنورة">المدينة المنورة</MenuItem>
                <MenuItem value="القصيم">القصيم</MenuItem>
                <MenuItem value="الشرقية">الشرقية</MenuItem>
                <MenuItem value="عسير">عسير</MenuItem>
                <MenuItem value="تبوك">تبوك</MenuItem>
                <MenuItem value="حائل">حائل</MenuItem>
                <MenuItem value="الحدود الشمالية">الحدود الشمالية</MenuItem>
                <MenuItem value="جازان">جازان</MenuItem>
                <MenuItem value="نجران">نجران</MenuItem>
                <MenuItem value="الباحة">الباحة</MenuItem>
                <MenuItem value="الجوف">الجوف</MenuItem>
              </TextField>
            </Grid>
            {/* المدينة */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
                label="المدينة"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
              />
            </Grid>
            {/* اسم الحي */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
                label="اسم الحي"
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
              />
            </Grid>
            {/* المهنة  */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
                label="المهنة"
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
              />
            </Grid>
            {/* هل انت الان على رأس العمل */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    flexDirection: "row-reverse", // Reverse the input and icon
                  },
                  "& .MuiSelect-icon": {
                    left: 14, // Adjust icon position
                    right: "auto", // Override default right position
                  },
                  "& .MuiOutlinedInput-input": {
                    textAlign: "right", // Keep text right-aligned
                    paddingRight: "14px !important", // Add space for the icon
                  },
                }}
                fullWidth
                label="هل انت الان على رأس العمل"
                select
                name="currently_working"
                value={formData.currently_working}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
                SelectProps={{
                  MenuProps: {
                    dir: "rtl", // RTL for dropdown menu
                  },
                }}
                inputProps={{
                  dir: "rtl", // RTL for input text
                }}
              >
                <MenuItem value={true}>نعم</MenuItem>
                <MenuItem value={false}>لا</MenuItem>
              </TextField>
            </Grid>
            {/* الحالة الاجتماعية */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    flexDirection: "row-reverse", // Reverse the input and icon
                  },
                  "& .MuiSelect-icon": {
                    left: 14, // Adjust icon position
                    right: "auto", // Override default right position
                  },
                  "& .MuiOutlinedInput-input": {
                    textAlign: "right", // Keep text right-aligned
                    paddingRight: "14px !important", // Add space for the icon
                  },
                }}
                fullWidth
                label="الحالة الاجتماعية"
                select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
                SelectProps={{
                  MenuProps: {
                    dir: "rtl", // RTL for dropdown menu
                  },
                }}
                inputProps={{
                  dir: "rtl", // RTL for input text
                }}
              >
                <MenuItem value="أعزب">أعزب</MenuItem>
                <MenuItem value="متزوج">متزوج</MenuItem>
              </TextField>
            </Grid>
            {/* هل عائلتك مقيمة معك حاليا */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    flexDirection: "row-reverse", // Reverse the input and icon
                  },
                  "& .MuiSelect-icon": {
                    left: 14, // Adjust icon position
                    right: "auto", // Override default right position
                  },
                  "& .MuiOutlinedInput-input": {
                    textAlign: "right", // Keep text right-aligned
                    paddingRight: "14px !important", // Add space for the icon
                  },
                }}
                fullWidth
                label="هل عائلتك مقيمة معك حاليا"
                select
                name="family_living_with_you"
                value={formData.family_living_with_you}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
                SelectProps={{
                  MenuProps: {
                    dir: "rtl", // RTL for dropdown menu
                  },
                }}
                inputProps={{
                  dir: "rtl", // RTL for input text
                }}
              >
                <MenuItem value={true}>نعم</MenuItem>
                <MenuItem value={false}>لا</MenuItem>
              </TextField>
            </Grid>
            {/* عدد الأفراد */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
                label="عدد أفراد العائلة"
                type="number"
                name="number_of_family_members"
                value={formData.number_of_family_members}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // التحقق من أن القيمة رقمية صحيحة بين 0 و10
                  if (
                    inputValue === "" ||
                    (/^[0-9]+$/.test(inputValue) &&
                      parseInt(inputValue) >= 0 &&
                      parseInt(inputValue) <= 10)
                  ) {
                    setFormData((prev) => ({
                      ...prev,
                      number_of_family_members:
                        inputValue === "" ? "" : parseInt(inputValue),
                    }));
                  }
                }}
                disabled={isPending}
                helperText="افراد العائلة (الزوجة والاطفال والاقارب)"
                required
                inputProps={{
                  min: 0,
                  max: 10,
                  step: 1,
                  pattern: "^[0-9]+$", // تقبل أرقام فقط
                  inputMode: "numeric", // لوحة أرقام على الجوال
                }}
                FormHelperTextProps={{
                  sx: {
                    textAlign: "right", // For RTL languages
                    marginRight: 0, // Adjust as needed
                  },
                }}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Family Members Fields */}
            {familyMembers.map((member, index) => (
              <Grid
                item
                xs={12}
                container
                spacing={2}
                key={index}
                sx={{ alignItems: "center", mb: 2 }}
              >
                <Grid item xs={12}>
                  <TextField
                    dir="rtl"
                    fullWidth
                    label={`اسم الفرد ${index + 1} بالعربي`}
                    type="text"
                    value={member.name_arabic || ""}
                    onChange={(e) =>
                      handleFamilyMemberChange(
                        index,
                        "name_arabic",
                        e.target.value
                      )
                    }
                    required
                    disabled={isPending}
                    InputLabelProps={{
                      className: "custom-label-rtl",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    dir="ltr"
                    fullWidth
                    label={`اسم الفرد ${index + 1} بالإنكليزي (اختياري)`}
                    type="text"
                    value={member.name_english || ""}
                    onChange={(e) =>
                      handleFamilyMemberChange(
                        index,
                        "name_english",
                        e.target.value
                      )
                    }
                    disabled={isPending}
                    helperText="اكتب الاسم كما هو في جواز السفر"
                    FormHelperTextProps={{
                      sx: {
                        textAlign: "right",
                        marginRight: 0,
                      },
                    }}
                    InputLabelProps={{
                      className: "custom-label-rtl",
                    }}
                  />
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* رقم الجوال */}
            <Grid item xs={12}>
              <TextField
                dir="ltr"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
                label="رقم الجوال"
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                required
                disabled={isPending}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
              />
            </Grid>
            {/* رقم جوال البديل */}
            <Grid item xs={12}>
              <TextField
                dir="ltr"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
                label="رقم الجوال البديل (اختياري)"
                type="tel"
                name="alternative_mobile_number"
                value={formData.alternative_mobile_number}
                onChange={handleChange}
                disabled={isPending}
                helperText="رقم جوال يمكن الرجوع اليه (رقم أحد الاقارب في السودان)"
                FormHelperTextProps={{
                  sx: {
                    textAlign: "right", // For RTL languages
                    marginRight: 0, // Adjust as needed
                  },
                }}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
              />
            </Grid>
            {/*  */}
            <Grid item xs={12}>
              <TextField
                dir="rtl"
                multiline
                rows={4} // Adjust number of visible rows
                fullWidth
                label="ملاحظات (اختياري)"
                name="note"
                value={formData.note}
                onChange={handleChange}
                disabled={isPending}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                  },
                }}
                InputLabelProps={{
                  className: "custom-label-rtl",
                }}
                FormHelperTextProps={{
                  sx: {
                    textAlign: "right",
                  },
                }}
              />
            </Grid>
          </Grid>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            disableRipple
            loading={isPending}
            sx={{ mt: 3, mb: 2, transition: "0.1s" }}
          >
            ارسال
          </LoadingButton>
        </Box>
      )}

      {/* Floating WhatsApp Button */}
      <Fab
        color="success"
        aria-label="whatsapp"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#25D366", // WhatsApp green color
          "&:hover": {
            backgroundColor: "#128C7E", // Darker WhatsApp green on hover
          },
        }}
        href="https://wa.me/966575132971" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon sx={{ color: "white", fontSize: 32 }} />
      </Fab>
    </div>
  );
}
