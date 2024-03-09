import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { storage, db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";

const initialState = {
  name: "",
  category: "",
  duration: "",
  price: "",
};

const AddEditMovie = () => {
  const [data, setData] = useState(initialState);
  const { name, category, duration, price } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const getSingleMovie = async () => {
        const docRef = doc(db, "movies", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setData({ ...snapshot.data() });
        }
      };
      getSingleMovie();
    }
  }, [id]);

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };

    if (file) uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = "Name is required";
    }
    if (!category) {
      errors.category = "Category is required";
    }
    if (!duration) {
      errors.duration = "Duration is required";
    }
    if (!price) {
      errors.price = "Price is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    try {
      const collectionRef = collection(db, "movies");
      if (!id) {
        await addDoc(collectionRef, {
          ...data,
          timestamp: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "movies", id), {
          ...data,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Grid centered verticalAlign="middle" columns="3" style={{ height: "80vh" }}>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              {isSubmit
              ? (
                <Loader active inline="centered" size="huge" />
              ) : (
                <>
                  <h2>{id ? "Update Movie" : "Add Movie"}</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      label="Name"
                      error={errors.name ? {content: errors.name} : null}
                      placeholder="Enter Name"
                      name="name"
                      onChange={handleChange}
                      value={name}
                    />
                    <Form.Input
                      label="Category"
                      error={errors.category ? {content: errors.category} : null}
                      placeholder="Enter Category"
                      name="category"
                      onChange={handleChange}
                      value={category}
                    />
                    <Form.Input
                      label="Duration"
                      error={errors.duration ? {content: errors.duration} : null}
                      placeholder="Enter Duration"
                      name="duration"
                      onChange={handleChange}
                      value={duration}
                    />
                    <Form.Input
                      label="Price"
                      error={errors.price ? {content: errors.price} : null}
                      placeholder="Enter Price"
                      name="price"
                      onChange={handleChange}
                      value={price}
                    />
                    <Form.Input 
                      label="Upload Image"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button 
                      primary 
                      type="submit" 
                      disabled={progress !== null && progress < 100}
                    >
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default AddEditMovie;