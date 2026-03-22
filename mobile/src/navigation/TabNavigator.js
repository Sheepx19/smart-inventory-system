import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ScanScreen from '../screens/ScanScreen';
import ProductsScreen from '../screens/ProductsScreen';
import StockScreen from '../screens/StockScreen';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.beige,
          borderTopWidth: 0,
          height: 70,
        },
        tabBarActiveTintColor: colors.brown,
        tabBarInactiveTintColor: colors.lightBrown,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddProductScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
    </Tab.Navigator>
  );
}
