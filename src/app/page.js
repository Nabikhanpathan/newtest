"use client";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import {
  AppBar,Toolbar,Typography,Button,TextField,Grid,Card,CardMedia, CardContent, CardActions, Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((response) => {
         setProducts(response.data);
      setFilteredProducts(response.data);
    });

    axios.get("https://fakestoreapi.com/products/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
       setSearch(query);
    setFilteredProducts(
      products.filter((product) => product.title.toLowerCase().includes(query))
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFilteredProducts(
      category ? products.filter((product) => product.category === category) : products
    );
  };

  return (
    <GoogleOAuthProvider clientId="google id">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            E-Commerce
          </Typography>
          <TextField
            label="Search"
     variant="outlined"
                 size="small"
            value={search}
            onChange={handleSearch}
            sx={{ backgroundColor: "white", borderRadius: 1, mr: 2 }}
          />
          {user ? (
            <Button color="inherit" onClick={() => { googleLogout(); setUser(null); }}>
              Logout
            </Button>
          ) : (
            <GoogleLogin
                  onSuccess={(res) => {
                setUser(res.credential);
              }}
              onError={() => console.log("Login Failed")}
            />
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
            width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, position: "fixed" },
        }}
      >
        <List>
          <ListItem button onClick={() => handleCategorySelect(null)}>
               <ListItemText primary="All Categories" />
          </ListItem>
          {categories.map((category) => (
            <ListItem button key={category} onClick={() => handleCategorySelect(category)}>
                 <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Container sx={{ ml: "260px", mt: 4 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
       {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} display="flex">
              <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <CardMedia component="img" height="140" image={product.image} alt={product.title} />
          <CardContent sx={{ flexGrow: 1 }}>
                       <Typography variant="h6">{product.title}</Typography>
            <Typography variant="body1">$ {product.price}</Typography>
                  <Typography variant="body2" color="textSecondary">
              {product.category}
                  </Typography>
                         </CardContent>
                <CardActions>
                  <Button fullWidth variant="contained" sx={{ backgroundColor: "yellow" }}>
           Add to Cart
                      </Button>
          </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </GoogleOAuthProvider>
  );
}
