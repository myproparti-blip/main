import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
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
import {
  Button,
  Checkbox,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", ""]);
  const otpRefs = useRef([]);
  const [agreed, setAgreed] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [timer, setTimer] = useState(0);
  const [resendAvailable, setResendAvailable] = useState(false);

  const roles = [
    "Buyer",
    "Agent",
    "Consultant",
    "Seller",
    "Investor",
    "Builder",
    "Dealer",
    "Owner",
  ];

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
      <Modal visible={visible} animationType="fade" transparent>
        <BlurView intensity={90} tint="dark" style={styles.overlay}>
          <View style={styles.sheetWrapper}>
            <LinearGradient
              colors={["#009688", "#00bcd4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientHeader}
            />
            <View style={[styles.sheet, { backgroundColor: theme.colors.elevation.level1 }]}>
              <TouchableOpacity style={styles.closeBtn} onPress={handleCancel}>
                <Text style={{ fontSize: 22, color: theme.colors.onSurface }}>✕</Text>
              </TouchableOpacity>

              <Image
                source={{
                  uri: "https://img.icons8.com/color/96/secured-letter--v1.png",
                }}
                style={styles.illustration}
              />

              {step === "phone" ? (
                <>
                  <Text variant="headlineMedium" style={styles.title}>
                    Verify Your Mobile Number
                  </Text>
                  <Text variant="bodyMedium" style={styles.subtitle}>
                    Get started by verifying your number below
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

                  <View style={styles.chipContainer}>
                    {roles.map((role, idx) => {
                      const isSelected = selectedRole === role;
                      return (
                        <TouchableOpacity
                          key={idx}
                          activeOpacity={0.9}
                          onPress={() =>
                            setSelectedRole(isSelected ? null : role)
                          }
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {role}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.termsContainer}>
                    <Checkbox.Android
                      status={agreed ? "checked" : "unchecked"}
                      onPress={() => setAgreed(!agreed)}
                      color="#009688"
                    />
                    <Text variant="bodySmall" style={styles.termsText}>
                      I agree to the{" "}
                      <Text style={{ color: "#009688", fontWeight: "bold" }}>
                        Terms of Service
                      </Text>{" "}
                      and{" "}
                      <Text style={{ color: "#009688", fontWeight: "bold" }}>
                        Privacy Policy
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      mode="outlined"
                      onPress={handleCancel}
                      style={[styles.btn, styles.cancelBtn]}
                      labelStyle={{ fontWeight: "600" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleSendOtp}
                      style={[styles.btn, styles.agreeBtn]}
                      labelStyle={{ fontWeight: "600" }}
                      disabled={!isValidPhone() || !agreed || !selectedRole}
                    >
                      Continue
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
                      style={{ color: "#009688", fontWeight: "bold" }}
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
                              ? "#009688"
                              : "rgba(0,0,0,0.1)",
                            shadowColor: digit ? "#009688" : "#000",
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
                          color: resendAvailable ? "#009688" : "#999",
                        },
                      ]}
                    >
                      {resendAvailable ? "Resend Code" : `Resend in ${timer}s`}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </BlurView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    width: "100%",
  },
  gradientHeader: {
    height: 6,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 26,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
  },
  illustration: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  title: {
    marginTop: 8,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 24,
    color: "#111",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
    fontSize: 15,
  },
  input: {
    width: "100%",
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 14,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#009688",
    borderRadius: 24,
    paddingVertical: 7,
    paddingHorizontal: 16,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: "#009688",
    borderColor: "#009688",
    shadowColor: "#009688",
  },
  chipText: {
    color: "#009688",
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#fff",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,150,136,0.07)",
    borderLeftWidth: 3,
    borderLeftColor: "#009688",
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 13.5,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  otpBox: {
    width: 58,
    height: 58,
    borderWidth: 2,
    borderRadius: 14,
    marginHorizontal: 6,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    backgroundColor: "#fff",
    shadowOpacity: 0.2,
    elevation: 3,
  },
  resend: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
});
