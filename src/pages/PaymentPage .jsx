import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
// Sample packages data
const packages = [
  {
    id: 1,
    name: "Free Trial",
    description:
      "7 days free listing to activate your business on Essential-Direct Ng.",
    price: 0.0,
    validity: "7 days",
    targetCustomers: 100,
    marketing: "Basic Marketing",
  },
  {
    id: 2,
    name: "Classified",
    description: "Post 2 products, 2 photos, and 1 category on our platform.",
    price: 1000.0,
    validity: "One-off visibility",
    targetCustomers: 600,
    marketing: "Basic Marketing",
  },
  {
    id: 3,
    name: "Ordinary",
    description:
      "Register 3 products, 4 photos, and 2 categories on our platform.",
    price: 2500.0,
    validity: "One-off visibility",
    targetCustomers: 200,
    marketing: "Enhanced Marketing",
  },
  {
    id: 4,
    name: "Platinum",
    description:
      "Post 9 products, 8 photos, 4 keywords, and 4 categories. Visibility on local, nationwide, and global platforms.",
    price: 4500.0,
    validity: "12 months visibility",
    targetCustomers: 4000,
    marketing: "Advanced Marketing",
  },
  {
    id: 5,
    name: "Silver Listing",
    description:
      "Post 11 products, 12 photos, 12 keywords, and 7 categories. Boost to social platforms, and visibility locally, nationwide, and globally.",
    price: 9000.0,
    validity: "12 months visibility",
    targetCustomers: 100,
    marketing: "Advanced Marketing",
  },
  {
    id: 6,
    name: "Gold Listing",
    description:
      "Post 14 products, 15 photos, 16 keywords, and 7 categories. Boost to social platforms, and visibility locally, nationwide, and globally.",
    price: 9279.0,
    validity: "12 months visibility",
    targetCustomers: 100,
    marketing: "Advanced Marketing",
  },
  {
    id: 7,
    name: "Gold Plus",
    description:
      "Post 14 products, 15 photos, 10 keywords, and 7 categories. Visibility on all platforms and in all regions with strong marketing.",
    price: 789090.0,
    validity: "12 months visibility",
    targetCustomers: null,
    marketing: "Comprehensive Marketing",
  },
];
const PaymentPage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState(null);

  // Fetch package details based on packageId (replace with API call)
  useEffect(() => {
    const pkg = packages.find((p) => p.id === parseInt(packageId));
    setPackageDetails(pkg);
  }, [packageId]);

  const handlePayment = () => {
    // Integrate payment gateway logic here
    alert(`Payment successful for ${packageDetails.name}`);
    navigate("/success"); // Redirect to success page
  };

  if (!packageDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Payment for {packageDetails.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Price: ₦{packageDetails.price.toLocaleString()}
      </Typography>
      <Button variant="contained" color="primary" onClick={handlePayment}>
        Proceed to Payment
      </Button>
    </Box>
  );
};

export default PaymentPage;
