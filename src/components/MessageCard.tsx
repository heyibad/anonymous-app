import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Message } from '@/models/user.model'
import axios from 'axios'
import { useToast } from './ui/use-toast'

type MessageCardProps = {
  message: Message,
  onDelete: (id: string) => void
}
const MessageCard = ({message,onDelete}:MessageCardProps) => {
  const {toast}=useToast()
  const deleteHandle = async() => {
    const {data}= await axios.post('/api/delete-messaage',{id:message.id})
    if(data.success){
      onDelete(message.id)
      toast({
        title:'Message Deleted',
        description:'Message Deleted Successfully',
      })
    }
    else{
      toast({
        title:'Error',
        description:'Error in Deleting Message',
        variant:'destructive',
      })
    }
  }
  return (
        <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteHandle}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Card Content</p>
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
        </Card>

  )
}

export default MessageCard