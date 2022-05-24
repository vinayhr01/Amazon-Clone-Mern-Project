import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { ToastContainer } from 'react-toastify'; // npm install react-toastify
import 'react-toastify/dist/ReactToastify.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import NavIcon from './NavIcon';
import SignInScreen from './screens/SignInScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignUpScreen from './screens/SignUpScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import CartHistoryScreen from './screens/CartHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashBoardScreen from './screens/DashBoardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, UserInfo } = state;

  const SignOutHandler = () => { // this is equivalent to writing as function SignOutHandler(){ ...... }
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('UserInfo');
    //localStorage.removeItem('ShippingAddress');
    localStorage.removeItem('PaymentMethod');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <header>
        <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg" fixed='top' >
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand><NavIcon></NavIcon>{' '}amazonia</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <SearchBox />
              <Nav className="me-auto w-100 justify-content-end" collapseOnSelect>
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {UserInfo ? (
                  <NavDropdown title={UserInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={SignOutHandler}>
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
                {UserInfo && UserInfo.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <main>
        <Container className="mt-3">
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/profile" element={<ProtectedRoute> <ProfileScreen /></ProtectedRoute>} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>}></Route>
            <Route path="/orderhistory" element={<ProtectedRoute><CartHistoryScreen /></ProtectedRoute>}></Route>
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/admin/dashboard" element={<AdminRoute> <DashBoardScreen /> </AdminRoute>}></Route>
            <Route path="/admin/products" element={<AdminRoute> <ProductListScreen /> </AdminRoute>}></Route>
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </Container>
      </main>
      <footer>
        <div className="text-center">All rights reserved &copy; 2022 </div>
      </footer>
    </BrowserRouter >
  );
}

export default App;
