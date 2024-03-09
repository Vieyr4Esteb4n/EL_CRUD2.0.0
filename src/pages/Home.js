import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { Button, Card, Grid, Container, Image } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import ModalComp from "../components/ModalComp";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "movies"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setMovies(list);
      setLoading(false);
    }, (error) => {
      console.log(error);
    });

    return () => {
      unsub();
    };
  }, []);

  const handleModal = (movie) => {
    setOpen(true);
    setSelectedMovie(movie);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this movie?")) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, "movies", id));
        setMovies(movies.filter((movie) => movie.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Container>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Card.Group>
          <Grid columns={3} stackable>
            {movies.map((movie) => (
              <Grid.Column key={movie.id}>
                <Card>
                  <Card.Content>
                    <Image
                      src={movie.img}
                      size="medium"
                      style={{
                        height: "150px",
                        width: "150px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <Card.Header style={{ marginTop: "10px" }}>
                      {movie.name}
                    </Card.Header>
                    <Card.Description>{movie.category} - {movie.duration} - ${movie.price}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div>
                      <Button
                        color="green"
                        onClick={() => navigate(`/update/${movie.id}`)}
                      >
                        Update
                      </Button>
                      <Button color="purple" onClick={() => handleModal(movie)}>
                        View
                      </Button>
                      {open && (
                        <ModalComp
                          open={open}
                          setOpen={setOpen}
                          handleDelete={handleDelete}
                          {...selectedMovie}
                        />
                      )}
                    </div>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
          </Grid>
        </Card.Group>
      )}
    </Container>
  );
};

export default Home;