
// Inside any function that uses metrics, update the format to use the correct array structure
// For example:

// Before:
// const equipmentMetrics = {
//   temperature: 85,
//   pressure: 150,
//   flow: 1200 
// };

// After:
const equipmentMetrics = [
  { key: "Temperature", value: "85°C" },
  { key: "Pressure", value: "150 kPa" },
  { key: "Flow", value: "1200 kg/h" }
];
