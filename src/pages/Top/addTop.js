import { Breadcrumbs, Button, Chip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from '@mui/material/styles';
import { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { deleteImages, postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { IoCloseSharp } from "react-icons/io5";


//breadcrump code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});


const AddTop = () => {


    const [isLoading, setIsLoading] = useState(false)
    const [formFields, setFormFields] = useState({
        name: '',
        images: [],
        color: '',
        slug: '',
        parentId: ''
    });

    const [files, setFiles] = useState([])
    const [imgFiles, setimgFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [originalUrls, setOriginalUrls] = useState([])
    const [isSelectedFiles, setIsSelectedFiles] = useState(false)


    //for claudinary images 
    // const [uploading, setUploading] = useState(false)

    const history = useNavigate();

    const context = useContext(MyContext)
    const formData = new FormData();


    // for upload imges in local folder with multer
    useEffect(() => {
        if (!imgFiles) return;

        let tmp = [];
        for (let i = 0; i < imgFiles.length; i++) {
            tmp.push(URL.createObjectURL(imgFiles[i]))
        }

        const objectUrls = tmp;
        setPreviews(objectUrls)

        for (let i = 0; i < objectUrls.length; i++) {
            return () => {
                URL.revokeObjectURL(objectUrls[i])
            }
        }
    }, [imgFiles])



    const changeInput = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ))

    }

    //for claudinary images 
    // let img_arr = []
    // let uniqueArray = []

    // const onchangeFile = async (e, apiEndPoint) => {
    //         try {
    //             const files = e.target.files;

    //             setUploading(true)

    //             for (let i = 0; i < files.length; i++) {

    //                 if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png')) {

    //                     const file = files[i]


    //                     imgArr.push(file)
    //                     formData.append('images', file)

    //                     setFiles(imgArr);
    //                     context.setAlertBox({
    //                         open: true,
    //                         error: false,
    //                         msg: "images uploaded!"
    //                     })

    //                     setIsSelectedFiles(true)

    //                     console.log(imgArr);
    //                     postData(apiEndPoint, formData).then((res) => {
    //                         context.setAlertBox({
    //                             open: true,
    //                             error: false,
    //                             msg: "images uploaded!"
    //                         })
    //                     })
    //                 } else {
    //                     context.setAlertBox({
    //                         open: true,
    //                         error: true,
    //                         msg: "Please select a valid JPG or PNG image file."
    //                     })
    //                 }

    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }


    // for upload imges in local folder with multer
    const onchangeFile = async (e, apiEndPoint) => {
        try {
            const imgArr = [];
            const files = e.target.files;

            for (let i = 0; i < files.length; i++) {

                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png')) {
                    setimgFiles(files)

                    const file = files[i]
                    imgArr.push(file)
                    formData.append('images', file)
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "Please select a valid JPG or PNG image file."
                    })
                }

            }
            setFiles(imgArr);
            setIsSelectedFiles(true)
            postData(apiEndPoint, formData).then((res) => {
                setOriginalUrls(res);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "images uploaded!"
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    const removeImg = async (index, imgUrl) => {
        try {
            const originalUrl = originalUrls[index];

            // Call the API to delete the image
            deleteImages(`/api/category/deleteImage?img=${originalUrl}`).then((res) => {
                if (res.success) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Image Deleted!",
                    });

                    const updatedOriginalUrls = originalUrls.filter((_, i) => i !== index);
                    const updatedpreviews = previews.filter((_, i) => i !== index);

                    setOriginalUrls(updatedOriginalUrls);
                    setPreviews(updatedpreviews);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg || "Failed to delete image",
                    });
                }
            })
        } catch (error) {
            console.error("Error deleting image:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Error deleting image",
            });
        }
    }

    const addCategory = (e) => {
        e.preventDefault()

        formFields.slug = formFields.name
        formData.append('name', formFields.name)
        formData.append('color', formFields.color)
        formData.append('slug', formFields.slug)


        if (formFields.name !== "" && formFields.color !== "" && isSelectedFiles !== false) {
            setIsLoading(true)

            postData('/api/category/create', formFields).then(res => {
                context.setAlertBox({
                    open: true,
                    msg: 'The category is created!',
                    error: false
                })
                setIsLoading(false)
                context.fetchCategory()
                history('/category')
            })
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details'
            })
            return false;
        }
    }



    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2 res-col">
                    <h5 className="mb-4">Add Top</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Top"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Add Top"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className="form" onSubmit={addCategory}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="card p-4 mt-0">
                                <div className="form-group">
                                    <h6>Top Name</h6>
                                    <input type="text" name="name" value={formFields.name} onChange={changeInput} />
                                </div>

                                <Button type="submit" className="btn-blue btn-lg btn-big w-100">{isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'ADD'}</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddTop;