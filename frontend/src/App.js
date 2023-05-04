import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import List from "./components/List/List";
import StoreApi from "./utils/storeApi";
import InputContainer from "./components/Input/InputContainer";
import { makeStyles } from "@material-ui/core/styles";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TopBar from "./components/TopBar";
import SideMenu from "./components/SideMenu ";
import axios from "axios";

const useStyle = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    width: "100%",
    overflowY: "auto",
  },
  listContainer: {
    display: "flex",
  },
}));

export default function App() {
  const [data, setData] = useState({ listIds: [], lists: {} });
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState("green");
  const classes = useStyle();

  async function getDataFromMongoDB() {
    try {
      const cardsResponse = await axios.get("http://locolhost:5000/cards");
      const cards = cardsResponse.data;

      const dataResponse = await axios.get("http://locolhost:5000/data");
      const data = dataResponse.data;

      setData(data);
      setCards(cards);

      return { cards, data };return { cards, data };
    } catch (err) {
      console.log(err);
    }
  }

  async function postDataToMongoDB(cards, data) {
    try {
      const response = await axios.post("http://locolhost:5000/cards", cards);
      const cards = response.data;

      const response1 = await axios.post("http://locolhost:5000/data", data);
      const data = response1.data;

      setData(data);
      setCards(cards);
      return { cards, data };
      console.log("Data posted successfully!");
    } catch (err) {
      console.log(err);
    }
  }

  

  useEffect(() => {
    getDataFromMongoDB();
    postDataToMongoDB(cards, data);
  }, []);

  const addMoreCard = async (title, listId) => {
    const newCardId = uuid();
    const newCard = {
      id: newCardId,
      title,
      id_list: listId,
    };

    const list = data.lists[listId];
    list.cards = [...list.cards, newCard];

    const newState = {
      ...data,
      lists: {
        ...data.lists,
        [listId]: list,
      },
    };
    setData(newState);

    await postDataToMongoDB(cards, data);
  };

  const addMoreList = async (title) => {
    const newListId = uuid();
    const newList = {
      id: newListId,
      title,
      cards: [],
    };
    const newState = {
      listIds: [...data.listIds, newListId],
      lists: {
        ...data.lists,
        [newListId]: newList,
      },
    };
    setData(newState);

    await postDataToMongoDB(cards, data);
  };

  const updateListTitle = (title, listId) => {
    const list = data.lists[listId];
    list.title = title;

    const newState = {
      ...data,
      lists: {
        ...data.lists,
        [listId]: list,
      },
    };
    setData(newState);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    console.log("destination", destination, "source", source, draggableId);

    if (!destination) {
      return;
    }
    if (type === "list") {
      const newListIds = data.listIds;
      newListIds.splice(source.index, 1);
      newListIds.splice(destination.index, 0, draggableId);
      return;
    }

    const sourceList = data.lists[source.droppableId];
    const destinationList = data.lists[destination.droppableId];
    const draggingCard = sourceList.cards.filter(
      (card) => card.id === draggableId
    )[0];

    if (source.droppableId === destination.droppableId) {
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggingCard);
      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: destinationList,
        },
      };
      setData(newState);
    } else {
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggingCard);

      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: sourceList,
          [destinationList.id]: destinationList,
        },
      };
      setData(newState);
    }
  };

  return (
    <StoreApi.Provider value={{ addMoreCard, addMoreList, updateListTitle }}>
      <div
        className={classes.root}
        style={{
          backgroundColor: backgroundImage,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <TopBar setOpen={setOpen} />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="app" type="list" direction="horizontal">
            {(provided) => (
              <div
                className={classes.listContainer}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {data.listIds.map((listId, index) => {
                  const list = data.lists[listId];
                  return <List list={list} key={listId} index={index} />;
                })}
                <InputContainer type="list" />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <SideMenu
          setBackgroundImage={setBackgroundImage}
          open={open}
          setOpen={setOpen}
        />
      </div>
    </StoreApi.Provider>
  );
}
