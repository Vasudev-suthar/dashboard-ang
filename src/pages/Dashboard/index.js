
import { FaEye, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect, useState } from "react";
import { Button, Rating } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { deleteData, fetchDataFromApi } from "../../utils/api";

export const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
];

export const options = {
    'backgroundColor': 'transparent',
    'chartArea': { 'width': '100%', 'height': '80%' },
};

const Dashboard = () => {

    // const [anchorEl, setAnchorEl] = useState(null);
    const [showBy, setshowBy] = useState(8);
    const [categoryVal, setcategoryVal] = useState('All');
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState()
    const [totalCategory, setTotalCategory] = useState()
    const [totalSubCategory, setTotalSubCategory] = useState()
    const [totalUsers, setTotalUsers] = useState()
    const [productList, setProductList] = useState([])

    // const open = Boolean(anchorEl);

    // const ITEM_HEIGHT = 48;

    const context = useContext(MyContext)

    useEffect(() => {
        context.setisHideSidebarAndHeader(false)

        window.scrollTo(0, 0)
        context.setProgress(40)
        fetchDataFromApi("/api/products?page=1&perPage=8").then((res) => {
            setProductList(res)
            context.setProgress(100)
        })

        fetchDataFromApi("/api/user/get/count").then((res) => {
            setTotalUsers(res.userCount)
        })
        fetchDataFromApi("/api/products/get/count").then((res) => {
            setTotalProducts(res.productsCount)
        })

        fetchDataFromApi("/api/category/get/count").then((res) => {
            setTotalCategory(res.categoryCount)
        })

        fetchDataFromApi("/api/category/subCat/get/count").then((res) => {
            setTotalSubCategory(res.categoryCount)
        })
    }, [])


    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    const deleteProduct = (id) => {
        context.setProgress(40)
        deleteData(`/api/products/${id}`).then((res) => {
            context.setProgress(100)
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product Deleted!'
            })
            fetchDataFromApi("/api/products?page=${page}&perPage=8").then((res) => {
                setProductList(res)
            })
        })
    }
    const handleChange = (event, value) => {
        context.setProgress(40)
        setPage(value)
        fetchDataFromApi(`/api/products?page=${value}&perPage=${showBy}`).then(res => {
            setProductList(res)
            window.scrollTo({
                top: 200,
                behavior: 'smooth'
            })
            context.setProgress(100)
        });
    }

    const showPerPage = (e) => {
        context.setProgress(40)
        setshowBy(e.target.value)
        fetchDataFromApi(`/api/products?page=${1}&perPage=${e.target.value}`).then((res) => {
            setProductList(res)
            context.setProgress(100)
        })
    }

    const handleChangeCategory = (event) => {
        context.setProgress(40)
        if (event.target.value !== "All") {
            setcategoryVal(event.target.value)
            fetchDataFromApi(`/api/products?category=${event.target.value}`).then((res) => {
                setProductList(res)
                context.setProgress(100)
            })
        } else {
            fetchDataFromApi("/api/products?page=1&perPage=8").then((res) => {
                setProductList(res)
                context.setProgress(100)
            })
        }
    }
    return (
        <>
            <div className="right-content w-100">

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>SHOW BY</h4>
                            <FormControl className="w-100" size="small">
                                <Select
                                    value={showBy}
                                    onChange={showPerPage}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100"
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={20}>10</MenuItem>
                                    <MenuItem value={30}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4>CATEGORY BY</h4>
                            <FormControl className="w-100" size="small">
                                <Select
                                    value={categoryVal}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100"
                                >
                                    <MenuItem value="All">
                                        <em>All</em>
                                    </MenuItem>
                                    {
                                        context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => {
                                            return (
                                                <MenuItem className="text-capitalize" value={cat._id} key={index}>{cat.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '300px' }}>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    productList?.products?.length !== 0 && productList?.products?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0">
                                                                <img src={`${context.baseUrl}/uploads/${item?.images[0]}`} className="w-100" alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="info pl-3">
                                                            <h6>{item?.name}</h6>
                                                            <p>{item?.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item?.category?.name}</td>
                                                <td>
                                                    <div style={{ width: "70px" }}>
                                                        <del className="old">Rs {item?.oldPrice}</del>
                                                        <span className="new text-danger">Rs {item?.price}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Link to='/product/details'>
                                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                                        </Link>
                                                        <Link to={`/product/edit/${item._id}`}>
                                                            <Button className="success" color="success"><FaPencilAlt /></Button>
                                                        </Link>
                                                        <Button className="error" color="error" onClick={() => deleteProduct(item._id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        {
                            productList?.totalPages > 1 &&
                            <div className="d-flex tableFooter">
                                <Pagination count={productList?.totalPages} color="primary" className="pagination"
                                    showFirstButton showLastButton onChange={handleChange} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;