import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Checkbox, Chip, Text, TextInput, useTheme } from "react-native-paper";
import { sendOtp, verifyOtp } from "./services/login";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState("phone");

  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", ""]);
  const otpRefs = useRef([]);
  const [agreed, setAgreed] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // ✅ only one role

  const [timer, setTimer] = useState(0);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Resend timer
  useEffect(() => {
    let t;
    if (timer > 0) t = setTimeout(() => setTimer(timer - 1), 1000);
    else setResendAvailable(true);
    return () => clearTimeout(t);
  }, [timer]);

  const isValidPhone = () => phone.replace(/\D/g, "").length === 10;

  const handleSendOtp = async () => {
    if (!isValidPhone()) return setErrorMsg("Please enter a valid 10-digit number");
    if (!selectedRole) return setErrorMsg("Please select a role");
    if (!agreed) return setErrorMsg("Please agree to the Terms first");

    try {
      setLoading(true);
      setErrorMsg("");

      const body = { phone: `+91${phone}`, role: [selectedRole] }; // ✅ single role array
      const response = await sendOtp(body);

      if (response?.success) {
        setStep("otp");
        setResendAvailable(false);
        setTimer(30);
        setOtpDigits(["", "", ""]);
      } else {
        setErrorMsg(response?.message || "Failed to send OTP");
      }
    } catch (error) {
      setErrorMsg(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpDigits.join("");
    if (otpCode.length !== 3) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const response = await verifyOtp({ phone: `+91${phone}`, otp: otpCode });

      if (response?.success) {
        Alert.alert("✅ Success", "Login successful!");
        setVisible(false);
        router.replace("(tabs)");
      } else {
        setErrorMsg(response?.message || "Incorrect OTP");
        setOtpDigits(["", "", ""]);
      }
    } catch (error) {
      setErrorMsg(error.message || "Network error while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otpDigits.join("").length === 3) handleVerifyOtp();
  }, [otpDigits]);

  const handleCancel = () => {
    setVisible(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleCancel}>
              <Text style={{ fontSize: 20, color: theme.colors.onSurface }}>✕</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: "https://img.icons8.com/fluency/96/security-checked.png" }}
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

                {/* ✅ Role Chips - single selection */}
                <View style={styles.rolesContainer}>
                  {["buyer", "seller", "agent", "consultant"].map((role) => (
                    <Chip
                      key={role}
                      selected={selectedRole === role}
                      onPress={() => setSelectedRole(role)}
                      style={[
                        styles.chip,
                        selectedRole === role && { backgroundColor: "#00968820" },
                      ]}
                      showSelectedCheck
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Chip>
                  ))}
                </View>

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

                {errorMsg ? <Text style={{ color: "red", marginBottom: 8 }}>{errorMsg}</Text> : null}

                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={[styles.btn, styles.cancelBtn]}
                    icon="close-circle"
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button
                    mode="contained-tonal"
                    onPress={handleSendOtp}
                    style={[styles.btn, styles.agreeBtn]}
                    disabled={!isValidPhone() || !agreed || !selectedRole || loading}
                    icon="check-decagram"
                    loading={loading}
                  >
                    Send OTP
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
                  <Text style={{ color: theme.colors.primary, fontWeight: "500" }} onPress={() => setStep("phone")}>
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
                          borderColor: digit ? theme.colors.primary : theme.colors.outline,
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

                {errorMsg ? <Text style={{ color: "red", marginBottom: 12 }}>{errorMsg}</Text> : null}

                <TouchableOpacity disabled={!resendAvailable || loading} onPress={handleSendOtp}>
                  <Text
                    style={[
                      styles.resend,
                      {
                        color: resendAvailable ? theme.colors.primary : theme.colors.outline,
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
    minHeight: 520,
    alignItems: "center",
    elevation: 10,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  illustration: {
    width: 110,
    height: 110,
    marginVertical: 12,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 26,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  chip: {
    borderRadius: 20,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 24,
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
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
    borderColor: "#000000",
  },
  agreeBtn: {
    backgroundColor: "#009688",
  },
  resend: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
});
