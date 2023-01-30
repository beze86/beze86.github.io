import { useForm, Controller } from 'react-hook-form';

import { Button, Card, CardContent, List, Stack, TextField } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { contactsApi } from 'client/modules/home-tasks/api/contact/contact';
import { ContactCreation, ContactId } from 'client/modules/home-tasks/domain/contact/contact';
import { ContactsListItem } from 'client/modules/home-tasks/ui/contact/ContactsListItem';
import { CenteredStack } from 'client/shared/components/CenteredStack/CenteredStack';

const STALE_TIME_5_MIN = 300000;

const CONTACT_LIST_QUERY = ['contacts', 'contact-list'];

const ContactsList = () => {
  const { createContact, deleteContact, getAllContactsByUser } = contactsApi();
  const contactListQuery = useQueryClient();

  const { data: contacts } = useQuery(CONTACT_LIST_QUERY, () => getAllContactsByUser(), {
    suspense: false,
    staleTime: STALE_TIME_5_MIN,
  });

  const {
    handleSubmit,
    control,
    reset: resetForm,
  } = useForm<ContactCreation>({
    defaultValues: {
      name: '',
    },
  });

  const { mutate: mutateCreateContact } = useMutation((data: ContactCreation) => createContact(data), {
    onSuccess: () => {
      resetForm();
      contactListQuery.invalidateQueries(CONTACT_LIST_QUERY);
    },
  });

  const { mutate: mutateDeleteContact } = useMutation((id: ContactId) => deleteContact(id), {
    onSuccess: () => contactListQuery.invalidateQueries(CONTACT_LIST_QUERY),
  });

  if (!contacts) return null;

  const handleDeleteClick = (id: ContactId) => {
    mutateDeleteContact(id);
  };

  const handleOnSubmitCreateContact = (data: ContactCreation) => {
    mutateCreateContact({ ...data });
  };

  return (
    <CenteredStack>
      <Card
        sx={{
          width: '100%',
        }}
      >
        <CardContent>
          <Stack
            component="form"
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            justifyContent="flex-end"
            gap={4}
            onSubmit={handleSubmit(handleOnSubmitCreateContact)}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => {
                return <TextField {...field} label="Add new contact" />;
              }}
            />
            <Button type="submit">Add Contacts</Button>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <List disablePadding>
            {contacts.map(({ name, _id }) => {
              return <ContactsListItem key={_id} name={name} onClickDeleteContact={() => handleDeleteClick(_id)} />;
            })}
          </List>
        </CardContent>
      </Card>
    </CenteredStack>
  );
};

export default ContactsList;