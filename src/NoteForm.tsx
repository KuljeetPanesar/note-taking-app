import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  /* pass in note data and expect nothing in return */
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  // refs will make the buttons functional. props are information related to the note
  const titleRef = useRef<HTMLInputElement>(null);
  // input ref as its text we input ourselves in the boxes of webpage
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  // text area refs as it is a text area element -- all refs added below in the form controls
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    }); // passing in note data. ! means it will never be null, as all fields always required as defined before

    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* built in bootstrap */}
      <Stack gap={4}>
        {/* spacing between the elements vertically */}
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title} />
              {/* required to give all elements a title */}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tags) => {
                      return { label: tags.label, id: tags.value };
                    })
                  );
                }}
                isMulti
              />
              {/* custom for tags - can add new tags that you type and add multiple at once
                    value is expected for creatable react select -- expects label and id 
                    on change to modify value. converting from label and value to label and id
                                                --> this is what is actually going to be stored*/}
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            defaultValue={markdown}
            required
            as="textarea"
            ref={markdownRef}
            rows={15}
          />
          {/* big area underneath as a textbox with 15 rows */}
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          {/* horizontal alignment, gap between and aligned at right side */}
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
          {/* submit button for save in blue variant colour -- cancel button in grey outline variant 
          Link makes it go back to homepage as the functionality of the button*/}
        </Stack>
      </Stack>
    </Form>
  );
}
