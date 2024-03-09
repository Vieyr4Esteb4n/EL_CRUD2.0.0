import React from 'react';
import { Modal, Header, Image, Button } from "semantic-ui-react";

const ModalComp = ({ open, setOpen, img, name, category, duration, price, id, handleDelete }) => {
    return (
        <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
            <Modal.Header>Movie Detail</Modal.Header>
            <Modal.Content image>
                <Image size="medium" src={img} wrapped />
                <Modal.Description>
                    <Header>{name}</Header>
                    <p>Category: {category}</p>
                    <p>Duration: {duration}</p>
                    <p>Price: ${price}</p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="black" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button 
                    color="red" 
                    content="Delete" 
                    labelPosition="right" 
                    icon="checkmark"
                    onClick={() => handleDelete(id)}
                />
            </Modal.Actions>
        </Modal>
    );
}

export default ModalComp;