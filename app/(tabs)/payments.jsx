// import {
//     Avatar,
//     Button,
//     Card,
//     Dialog,
//     Divider,
//     List,
//     Portal,
//     Snackbar,
//     Text,
//     TextInput,
//     useTheme,
// } from 'react-native-paper';

// export default function PaymentsScreen() {
//   const theme = useTheme();

//   // ==== STATE ====
//   const [balance, setBalance] = React.useState(12450);
//   const [transactions, setTransactions] = React.useState([
//     { title: 'Property Booking Payment', date: '03 Oct 2025', amount: 25000, type: 'credit', icon: 'home' },
//     { title: 'Legal Consultation Fee', date: '28 Sep 2025', amount: 1500, type: 'debit', icon: 'scale-balance' },
//     { title: 'Escrow Deposit', date: '21 Sep 2025', amount: 50000, type: 'credit', icon: 'bank-outline' },
//   ]);

//   const [snackbarVisible, setSnackbarVisible] = React.useState(false);
//   const [snackbarMsg, setSnackbarMsg] = React.useState('');

//   const [dialogVisible, setDialogVisible] = React.useState(false);
//   const [dialogType, setDialogType] = React.useState(null);
//   const [amount, setAmount] = React.useState('');

//   // ==== FUNCTIONS ====

//   const openDialog = (type) => {
//     setDialogType(type);
//     setAmount('');
//     setDialogVisible(true);
//   };

//   const handleTransaction = () => {
//     const amt = parseFloat(amount);
//     if (isNaN(amt) || amt <= 0) {
//       setSnackbarMsg('Enter a valid amount');
//       setSnackbarVisible(true);
//       return;
//     }

//     if (dialogType === 'withdraw' && amt > balance) {
//       setSnackbarMsg('Insufficient balance');
//       setSnackbarVisible(true);
//       return;
//     }

//     // Update balance
//     const newBalance = dialogType === 'add' ? balance + amt : balance - amt;
//     setBalance(newBalance);

//     // Add to transactions
//     const newTx = {
//       title: dialogType === 'add' ? 'Funds Added' : 'Withdrawal',
//       date: new Date().toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//       }),
//       amount: amt,
//       type: dialogType === 'add' ? 'credit' : 'debit',
//       icon: dialogType === 'add' ? 'cash-plus' : 'cash-minus',
//     };
//     setTransactions([newTx, ...transactions]);

//     // Close dialog + show snackbar
//     setDialogVisible(false);
//     setSnackbarMsg(
//       dialogType === 'add'
//         ? `₹${amt.toFixed(2)} added successfully`
//         : `₹${amt.toFixed(2)} withdrawn successfully`
//     );
//     setSnackbarVisible(true);
//   };

//   const handleQuickAction = (label) => {
//     setSnackbarMsg(`${label} action clicked`);
//     setSnackbarVisible(true);
//   };

//   return (
//     <ScrollView
//       style={{ flex: 1, backgroundColor: theme.colors.background }}
//       contentContainerStyle={{ padding: 16 }}
//     >
//       {/* === Balance Card === */}
//       <Card
//         style={{
//           borderRadius: 16,
//           marginBottom: 20,
//           backgroundColor: theme.colors.primaryContainer ?? '#1976D2',
//         }}
//       >
//         <Card.Content style={{ alignItems: 'center', paddingVertical: 25 }}>
//           <MaterialCommunityIcons name="wallet" size={48} color="#fff" />
//           <Text variant="titleLarge" style={{ color: '#fff', marginTop: 8 }}>
//             Wallet Balance
//           </Text>
//           <Text variant="headlineMedium" style={{ color: '#fff', fontWeight: 'bold', marginVertical: 4 }}>
//             ₹ {balance.toLocaleString('en-IN')}
//           </Text>

//           <View style={{ flexDirection: 'row', marginTop: 20 }}>
//             <Button
//               mode="contained"
//               buttonColor="#fff"
//               textColor={theme.colors.primary}
//               style={{ marginHorizontal: 6, borderRadius: 8 }}
//               icon="cash-plus"
//               onPress={() => openDialog('add')}
//             >
//               Add Funds
//             </Button>
//             <Button
//               mode="outlined"
//               textColor="#fff"
//               style={{ marginHorizontal: 6, borderRadius: 8, borderColor: '#fff' }}
//               icon="cash-minus"
//               onPress={() => openDialog('withdraw')}
//             >
//               Withdraw
//             </Button>
//           </View>
//         </Card.Content>
//       </Card>

//       {/* === Quick Actions === */}
//       <Card style={{ borderRadius: 16, marginBottom: 20 }}>
//         <Card.Title title="Quick Actions" titleStyle={{ fontWeight: 'bold' }} />
//         <Divider />
//         <Card.Content>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               marginVertical: 10,
//             }}
//           >
//             {[
//               { icon: 'qrcode-scan', label: 'Scan & Pay' },
//               { icon: 'bank-transfer', label: 'Bank Transfer' },
//               { icon: 'file-document-outline', label: 'Invoices' },
//             ].map((item, idx) => (
//               <View key={idx} style={{ alignItems: 'center' }}>
//                 <Avatar.Icon
//                   size={52}
//                   icon={item.icon}
//                   onTouchEnd={() => handleQuickAction(item.label)}
//                 />
//                 <Text variant="bodySmall" style={{ marginTop: 4 }}>
//                   {item.label}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </Card.Content>
//       </Card>

//       {/* === Transactions === */}
//       <Card style={{ borderRadius: 16 }}>
//         <Card.Title title="Recent Transactions" titleStyle={{ fontWeight: 'bold' }} />
//         <Divider />
//         <Card.Content>
//           <List.Section>
//             {transactions.map((tx, index) => (
//               <View key={index}>
//                 <List.Item
//                   title={tx.title}
//                   description={tx.date}
//                   left={() => <List.Icon icon={tx.icon} />}
//                   right={() => (
//                     <Text
//                       style={{
//                         color: tx.type === 'credit' ? 'green' : 'red',
//                         fontWeight: 'bold',
//                       }}
//                     >
//                       {tx.type === 'credit' ? '+' : '–'} ₹{tx.amount.toLocaleString('en-IN')}
//                     </Text>
//                   )}
//                 />
//                 {index < transactions.length - 1 && <Divider />}
//               </View>
//             ))}
//           </List.Section>
//         </Card.Content>
//       </Card>

//       {/* === Dialog for Add / Withdraw === */}
//       <Portal>
//         <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
//           <Dialog.Title>
//             {dialogType === 'add' ? 'Add Funds' : 'Withdraw Funds'}
//           </Dialog.Title>
//           <Dialog.Content>
//             <TextInput
//               label="Enter Amount (₹)"
//               mode="outlined"
//               keyboardType="numeric"
//               value={amount}
//               onChangeText={setAmount}
//             />
//           </Dialog.Content>
//           <Dialog.Actions>
//             <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
//             <Button onPress={handleTransaction}>
//               {dialogType === 'add' ? 'Add' : 'Withdraw'}
//             </Button>
//           </Dialog.Actions>
//         </Dialog>
//       </Portal>

//       {/* === Snackbar Feedback === */}
//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={3000}
//       >
//         {snackbarMsg}
//       </Snackbar>

//       <Text
//         style={{
//           textAlign: 'center',
//           color: '#888',
//           marginVertical: 20,
//           fontSize: 12,
//         }}
//       >
//         Secure payments powered by MyProParti • UPI / Bank / Credit Card supported
//       </Text>
//     </ScrollView>
//   );
// }
