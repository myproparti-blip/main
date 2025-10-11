import { useState } from "react";
import { ActivityIndicator, Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { createUpiOrder, verifyUpiPayment } from "./services/payment.js";
const Payment = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState("");

  // Generate clean Razorpay HTML without header and profile
  const getRazorpayHtml = (order) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <style>
          .razorpay-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 9999;
          }
        </style>
      </head>
      <body>
        <div class="razorpay-container">
          <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <div>Loading payment gateway...</div>
          </div>
        </div>
        <script>
          function initializeRazorpay() {
            const options = {
              key: "${order.key}",
              amount: "${order.amount}",
              currency: "INR",
              description: "Payment for service",
              order_id: "${order.orderId}",
              theme: { color: "#F37254" },
              handler: function(response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  status: "success",
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }));
              },
              modal: {
                ondismiss: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    status: "cancelled"
                  }));
                }
              }
            };
            const rzp = new Razorpay(options);
            // Remove Razorpay header events
            rzp.on('ready', function(response) {
              // Hide header elements if possible
              setTimeout(() => {
                const headerElements = document.querySelectorAll('.razorpay-header, .header, [class*="header"]');
                headerElements.forEach(el => {
                  if (el.innerHTML.includes('Back') || el.innerHTML.includes('Profile')) {
                    el.style.display = 'none';
                  }
                });
              }, 100);
            });
            rzp.open();
            rzp.on('payment.failed', function(response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: "failed",
                error: response.error
              }));
            });
          }
          if (typeof Razorpay !== 'undefined') {
            initializeRazorpay();
          } else {
            let checkCount = 0;
            const checkRazorpay = setInterval(() => {
              if (typeof Razorpay !== 'undefined') {
                clearInterval(checkRazorpay);
                initializeRazorpay();
              }
              checkCount++;
              if (checkCount > 10) {
                clearInterval(checkRazorpay);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  status: "error",
                  error: "Payment gateway failed to load"
                }));
              }
            }, 500);
          }
        </script>
      </body>
    </html>
  `;
  const startPayment = async () => {
    try {
      setLoading(true);
      const res = await createUpiOrder(500, userId);
      if (!res.success) {
        setLoading(false);
        return Alert.alert("Error", res.message);
      }
      if (Platform.OS === "web") {
        // Web implementation
        setLoading(false);
        if (typeof window.Razorpay === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => openRazorpayWeb(res);
          script.onerror = () => {
            Alert.alert("Error", "Failed to load payment gateway");
          };
          document.body.appendChild(script);
        } else {
          openRazorpayWeb(res);
        }
      } else {
        // Mobile: Use WebView as full page
        const htmlContent = getRazorpayHtml(res);
        setCheckoutHtml(htmlContent);
        setShowWebView(true);
        setLoading(false);
      }
    } catch (err) {
      console.log("Start payment error:", err);
      setLoading(false);
      Alert.alert("Error", "Something went wrong: " + err.message);
    }
  };
  // Web implementation
  const openRazorpayWeb = (res) => {
    const options = {
      key: res.key,
      amount: res.amount,
      currency: "INR",
      description: "Payment for service",
      order_id: res.orderId,
      theme: { color: "#F37254" },
      handler: async (response) => {
        const verifyRes = await verify(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        );
        if (verifyRes.success) {
          setPaymentCompleted(true);
          Alert.alert("Success", "Payment verified successfully!");
        } else {
          Alert.alert("Failed", "Payment verification failed!");
        }
      },
      modal: {
        ondismiss: () => {
          Alert.alert("Info", "Payment was cancelled");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  // Handle WebView messages
  const handleWebViewMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.status) {
        case "success":
          setLoading(true);
          const verifyRes = await verifyUpiPayment(
            data.razorpay_order_id,
            data.razorpay_payment_id,
            data.razorpay_signature
          );
          setShowWebView(false);
          setCheckoutHtml("");
          if (verifyRes.success) {
            setPaymentCompleted(true);
            Alert.alert("Success", "Payment verified successfully!");
          } else {
            Alert.alert("Failed", "Payment verification failed!");
          }
          setLoading(false);
          break;
        case "cancelled":
          setShowWebView(false);
          setCheckoutHtml("");
          Alert.alert("Cancelled", "Payment was cancelled");
          break;
        case "failed":
          setShowWebView(false);
          setCheckoutHtml("");
          Alert.alert("Payment Failed", data.error?.description || "Payment failed");
          break;
        case "error":
          setShowWebView(false);
          setCheckoutHtml("");
          Alert.alert("Error", data.error || "Payment gateway error");
          break;
        default:
          setShowWebView(false);
          setCheckoutHtml("");
          break;
      }
    } catch (err) {
      console.log("WebView message error:", err);
      setShowWebView(false);
      setCheckoutHtml("");
      setLoading(false);
    }
  };
  if (showWebView) {
    return (
      <View style={styles.fullScreenWebView}>
        <WebView
          originWhitelist={['*']}
          source={{ html: checkoutHtml }}
          style={styles.fullWebView}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000FF" />}
      {!paymentCompleted && !loading && !showWebView && (
        <Button title="Pay ₹500" onPress={startPayment} />
      )}
      {paymentCompleted && <Text style={styles.successText}>:white_check_mark: Payment Successful!</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  fullScreenWebView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fullWebView: {
    flex: 1,
  },
  successText: {
    fontSize: 18,
    color: "green",
    marginTop: 20
  },
});
export default Payment;