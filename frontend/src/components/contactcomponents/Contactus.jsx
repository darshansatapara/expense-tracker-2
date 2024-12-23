import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { Email } from "@mui/icons-material";

// Styled components
const Background = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#D9EAFD", // Background color as requested
  padding: theme.spacing(4),
  overflow: "hidden",
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  color: "#333",
  marginBottom: theme.spacing(6),
  padding: theme.spacing(2),
  width: "100%",
  "& h3": {
    fontFamily: "'Nunito', sans-serif", // Apply Nunito font
    fontWeight: "bold",
    fontSize: "4rem", // Larger size for more prominence
    color: "#ff6f61", // Vibrant color for the title
    textShadow: "3px 3px 8px rgba(0, 0, 0, 0.2)", // Text shadow for depth
    letterSpacing: "1px", // Slight letter spacing for elegance
    marginBottom: theme.spacing(3),
  },
  "& h6": {
    fontFamily: "'Nunito', sans-serif", // Apply Nunito font
    fontSize: "1.4rem",
    color: "#555",
  },
}));

const ContactInfoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  maxWidth: "1200px",
  margin: "auto",
}));

const ContactInfoSection = styled(Box)(({ theme }) => ({
  background: "#E8DFF7", // A slightly darker, warmer beige
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  textAlign: "center",
  maxWidth: "500px",
  width: "90%",
  marginLeft: theme.spacing(4),
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", // Slight shadow for a modern look
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontWeight: "bold",
  background: "#ff6f61", // A more vibrant button color
  color: "#fff",
  "&:hover": {
    background: "#e35d4b", // Slightly darker on hover
  },
  borderRadius: "30px", // Rounded button for modern look
}));

const AnimatedImage = styled(motion.img)(({ theme }) => ({
  width: "100%",
  height: "auto",
  objectFit: "cover",
  maxWidth: "100%", // Image will span the full width
  maxHeight: "800px", // Increased height for a larger image
  clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)", // Diagonal cut-out effect
  borderRadius: theme.spacing(3),
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
}));

const FooterSection = styled(Box)(({ theme }) => ({
  color: "#333",
  textAlign: "center",
  fontSize: "14px",
  marginTop: theme.spacing(4),
  fontFamily: "'Nunito', sans-serif", // Apply Nunito font
  color: "#888",
}));

const ContactUs = () => {
  return (
    <Background>
      {/* Main Container */}
      <Box width="100%" maxWidth="1200px" margin="auto">
        {/* Header Section */}
        <HeaderSection>
          <Typography variant="h3" fontWeight="bold">
            Get in Touch!
          </Typography>
          <Typography
            variant="body1"
            mt={2}
            sx={{
              fontFamily: "'Nunito', sans-serif", // Apply Nunito font
              fontSize: "1.1rem", // Smaller text size for a more subtle look
              color: "#555", // A softer text color
              lineHeight: "1.6", // Adjust line spacing for better readability
              letterSpacing: "0.5px", // Slight letter spacing for clarity
            }}
          >
            If you have any questions, suggestions, or need assistance with using Expense Tracker, we’re here to help! Our team is dedicated to ensuring you have the best experience while managing your finances. Whether you're having trouble with a feature or simply want to share feedback, don’t hesitate to get in touch with us. We promise to respond as quickly as possible, usually within 24-48 hours. We value your input and look forward to hearing from you to make Expense Tracker even better for everyone.
          </Typography>
        </HeaderSection>

        {/* Main Content Container */}
        <ContactInfoContainer>
          {/* Left Side Image */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <AnimatedImage
              src="/images/imgeee.png" // Ensure the image path is correct
              alt="Contact Illustration"
            />
          </motion.div>

          {/* Right Side Content */}
          <ContactInfoSection>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                fontFamily: "'Nunito', sans-serif", // Apply Nunito font
                color: "#ff6f61", // Set a new color for the title
              }}
            >
              Contact Information
            </Typography>
            <Typography
              variant="body1"
              mt={2}
              sx={{
                fontFamily: "'Nunito', sans-serif", // Apply Nunito font
                color: "#333", // Set a color to match the overall page theme
              }}
            >
              Have any questions? We'd love to hear from you!
            </Typography>
            <Typography
              variant="body2"
              mt={3}
              fontWeight="bold"
              sx={{
                color: "#000", // Darker color for email for clarity
              }}
            >
              ✉️ Email: expensetracker1908@gmail.com
            </Typography>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <StyledButton
                variant="contained"
                startIcon={<Email />}
                href="mailto:expensetracker1908@gmail.com"
              >
                Email Us
              </StyledButton>
            </motion.div>
          </ContactInfoSection>
        </ContactInfoContainer>

        {/* Footer Section */}
        <FooterSection>
          <Typography>
            © 2024 Expense Tracker. All Rights Reserved.
          </Typography>
        </FooterSection>
      </Box>
    </Background>
  );
};

export default ContactUs;
