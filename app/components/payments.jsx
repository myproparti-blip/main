import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
const UpiPaymentScreen = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("Property Booking");
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const UPI_ID = "7416698451@ptyes"; // your real UPI
  const RECEIVER_NAME = "MyProparti Pvt Ltd";
  // Listen for UPI callback response
  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleUpiResponse);
    return () => subscription.remove();
  }, []);
  const handleUpiResponse = (event) => {
    const url = event.url;
    if (url && url.includes("status=")) {
      const status = new URLSearchParams(url.split("?")[1]).get("Status");
      const txnId = new URLSearchParams(url.split("?")[1]).get("txnId");
      const responseCode = new URLSearchParams(url.split("?")[1]).get("responseCode");
      if (status?.toLowerCase() === "success") {
        setPaymentResult({ success: true, txnId });
        Alert.alert(":white_check_mark: Payment Successful", `Transaction ID: ${txnId}`);
      } else {
        setPaymentResult({ success: false, responseCode });
        Alert.alert(":x: Payment Failed", "Your payment could not be completed.");
      }
    }
  };
  const startPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    setLoading(true);
    const params = {
      pa: UPI_ID,
      pn: RECEIVER_NAME,
      tn: note,
      am: amount,
      cu: "INR",
      // :point_down: this part is critical — set your custom scheme for callback
      url: "myproparti://upiresponse"
    };
    const upiUrl =
      `upi://pay?pa=${params.pa}&pn=${encodeURIComponent(params.pn)}&tn=${encodeURIComponent(
        params.tn
      )}&am=${params.am}&cu=${params.cu}&url=${params.url}`;
    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        await Linking.openURL(upiUrl);
      } else {
        Alert.alert(
          "No UPI App Found",
          "Please install Google Pay, PhonePe, or Paytm."
        );
      }
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" }}>
      <Card style={{ padding: 20, borderRadius: 15, elevation: 3 }}>
        <Text variant="headlineSmall" style={{ textAlign: "center", marginBottom: 15 }}>
          :money_with_wings: UPI Payment
        </Text>
        <TextInput
          label="Amount (₹)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 15 }}
        />
        <TextInput
          label="Payment Note"
          value={note}
          onChangeText={setNote}
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            mode="contained"
            onPress={startPayment}
            style={{ borderRadius: 8, padding: 5, backgroundColor: "#007BFF" }}
          >
            Pay Now
          </Button>
        )}
        {paymentResult && (
          <Text style={{ textAlign: "center", marginTop: 15, color: paymentResult.success ? "green" : "red" }}>
            {paymentResult.success ? "Payment Success!" : "Payment Failed"}
          </Text>
        )}
        <Text style={{ textAlign: "center", marginTop: 10, color: "gray" }}>
          Powered by UPI – Secure Payment
        </Text>
      </Card>
    </View>
  );
};
export default UpiPaymentScreen;