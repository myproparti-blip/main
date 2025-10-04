import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Checkbox, Text, TextInput, useTheme } from "react-native-paper";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState("phone");

  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", ""]);
  const otpRefs = useRef([]);
  const [agreed, setAgreed] = useState(false);

  const [timer, setTimer] = useState(0);
  const [resendAvailable, setResendAvailable] = useState(false);

  // Fake timer for resend code
  useEffect(() => {
    let t;
    if (timer > 0) t = setTimeout(() => setTimer(timer - 1), 1000);
    else setResendAvailable(true);
    return () => clearTimeout(t);
  }, [timer]);

  const isValidPhone = () => phone.replace(/\D/g, "").length === 10;

  const handleSendOtp = () => {
    if (!isValidPhone()) return;
    setStep("otp");
    setResendAvailable(false);
    setTimer(30);
    setOtpDigits(["", "", ""]);
  };

  const handleCancel = () => {
    setVisible(false);
    router.back();
  };

  // 🚀 Navigate automatically when OTP complete
  useEffect(() => {
    if (otpDigits.join("").length === 3) {
      router.replace("(tabs)");
      setVisible(false);
    }
  }, [otpDigits]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleCancel}>
              <Text style={{ fontSize: 20, color: theme.colors.onSurface }}>✕</Text>
            </TouchableOpacity>

            <Image
              source={{
                uri: "https://img.icons8.com/fluency/96/security-checked.png",
              }}
              style={styles.illustration}
            />

            {step === "phone" ? (
              <>
                <Text variant="headlineMedium" style={styles.title}>
                  Verify Your Number
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  We'll send you a verification code
                </Text>

                <TextInput
                  label="Mobile Number"
                  mode="outlined"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.input}
                  left={<TextInput.Icon icon="phone" />}
                />

                <View style={styles.termsContainer}>
                  <Checkbox.Android
                    status={agreed ? "checked" : "unchecked"}
                    onPress={() => setAgreed(!agreed)}
                    color={theme.colors.primary}
                  />
                  <Text variant="bodySmall" style={styles.termsText}>
                    I agree to the Terms of Service and Privacy Policy
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={[styles.btn, styles.cancelBtn]}
                    icon="close-circle"
                  >
                    Cancel
                  </Button>

                  <Button
                    mode="contained-tonal"
                    onPress={handleSendOtp}
                    style={[styles.btn, styles.agreeBtn]}
                    disabled={!isValidPhone() || !agreed}
                    icon="check-decagram"
                  >
                    Agree & Continue
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Text variant="headlineMedium" style={styles.title}>
                  Enter Verification Code
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  Code sent to +91-{phone}{" "}
                  <Text
                    style={{ color: theme.colors.primary, fontWeight: "500" }}
                    onPress={() => setStep("phone")}
                  >
                    Change
                  </Text>
                </Text>

                <View style={styles.otpContainer}>
                  {otpDigits.map((digit, i) => (
                    <RNTextInput
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      value={digit}
                      style={[
                        styles.otpBox,
                        {
                          borderColor: digit
                            ? theme.colors.primary
                            : theme.colors.outline,
                        },
                      ]}
                      maxLength={1}
                      keyboardType="number-pad"
                      onChangeText={(val) => {
                        const newOtp = [...otpDigits];
                        newOtp[i] = val;
                        setOtpDigits(newOtp);

                        if (val && i < 2) otpRefs.current[i + 1].focus();
                        if (!val && i > 0) otpRefs.current[i - 1].focus();
                      }}
                      autoFocus={i === 0}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  disabled={!resendAvailable}
                  onPress={handleSendOtp}
                >
                  <Text
                    style={[
                      styles.resend,
                      {
                        color: resendAvailable
                          ? theme.colors.primary
                          : theme.colors.outline,
                        opacity: resendAvailable ? 1 : 0.6,
                      },
                    ]}
                  >
                    {resendAvailable ? "Resend Code" : `Resend code in ${timer}s`}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    minHeight: 480,
    alignItems: "center",
    elevation: 10,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 8,
    marginBottom: 4,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  illustration: {
    width: 110,
    height: 110,
    marginVertical: 12,
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 26,
    letterSpacing: 0.3,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
    paddingHorizontal: 12,
    color: "#666",
    fontSize: 15,
  },
  input: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 28,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0,150,136,0.05)",
    paddingVertical: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#009688",
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
    lineHeight: 20,
    color: "#333",
    fontSize: 13.5,
    fontWeight: "500",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 36,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 14,
    marginHorizontal: 6,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 6,
  },
  btn: {
    flex: 1,
    borderRadius: 16,
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: "#E53935",
  },
  agreeBtn: {
    backgroundColor: "#009688",
  },
  resend: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
