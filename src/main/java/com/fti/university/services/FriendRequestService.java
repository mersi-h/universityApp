package com.fti.university.services;

import com.fti.university.models.FriendRequest;
import com.fti.university.models.Status;
import com.fti.university.models.User;
import com.fti.university.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FriendRequestService {

    @Autowired
    private UserRepository userRepository;

    /**
     * @param senderId
     * @param receiverId
     * @return
     */
    public ResponseEntity<?> newFriendRequest(String senderId, String receiverId){
        try{
            Optional<User> sender=userRepository.findById(senderId);
            Optional<User> receiver=userRepository.findById(receiverId);

            if(sender.isPresent() && receiver.isPresent()){
                if(sender.get().getFriends().contains(receiver.get())){
                    return new ResponseEntity<>(sender.get().getUsername(), HttpStatus.BAD_REQUEST);
                }
                else if(sender.get().getFriendRequests().stream().anyMatch(friendRequest -> friendRequest.getReceiverUsername().equals(receiver.get().getUsername()))){
                    return new ResponseEntity<>(sender.get().getUsername(),HttpStatus.BAD_REQUEST);
                }
                else{
                        FriendRequest friendRequest=new FriendRequest();
                        friendRequest.setId(UUID.randomUUID().toString());
                        friendRequest.setSenderUsername(sender.get().getUsername());
                        friendRequest.setReceiverUsername(receiver.get().getUsername());
                        List<FriendRequest> senderFriendRequestList=sender.get().getFriendRequests();
                        List<FriendRequest> receiverFriendRequestsList=receiver.get().getFriendRequests();
                        senderFriendRequestList.add(friendRequest);
                        sender.get().setFriendRequests(senderFriendRequestList);
                        receiverFriendRequestsList.add(friendRequest);
                        receiver.get().setFriendRequests(receiverFriendRequestsList);
                        userRepository.save(sender.get());
                        userRepository.save(receiver.get());
                        return new ResponseEntity<>(friendRequest,HttpStatus.OK);
                }
            }
            else
                return new ResponseEntity<>("Couldn't find this user!",HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }

    /**
     * @param userId
     * @param friendRequestId
     * @return
     */
    public ResponseEntity<?> acceptFriendRequest(String userId, String friendRequestId){
        try{
            Optional<User> receiver=userRepository.findById(userId);
            if(receiver.isPresent()){
                List<FriendRequest> receiverFriendRequests=receiver.get().getFriendRequests();
                FriendRequest newFriendRequest=receiverFriendRequests.stream().filter((friendRequest)-> friendRequest.getId().equals(friendRequestId)).findFirst().orElse(null);
                if(newFriendRequest!=null){
                    List<String> receiverFriends=receiver.get().getFriends();
                    receiverFriends.add(newFriendRequest.getSenderUsername());
                    Optional<User> sender=userRepository.findByUsername(newFriendRequest.getSenderUsername());
                    List<String> senderFriends=sender.get().getFriends();
                    senderFriends.add(newFriendRequest.getReceiverUsername());
                    List<FriendRequest> senderFriendRequests=sender.get().getFriendRequests();
                    receiverFriendRequests.remove(newFriendRequest);
                    senderFriendRequests.remove(newFriendRequest);

                    receiver.get().setFriends(receiverFriends);
                    receiver.get().setFriendRequests(receiverFriendRequests);
                    sender.get().setFriends(senderFriends);
                    sender.get().setFriendRequests(senderFriendRequests);

                    userRepository.save(receiver.get());
                    userRepository.save(sender.get());
                    return new ResponseEntity<>(newFriendRequest,HttpStatus.ACCEPTED);
                }
                    return new ResponseEntity<>("No friend request found with this id:"+friendRequestId,HttpStatus.NOT_FOUND);
            }
                return new ResponseEntity<>("No user found with this id:"+userId,HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param userId
     * @param friendRequestId
     * @return
     */
    public ResponseEntity<?> declineFriendRequest(String userId,String friendRequestId){
        try{
            Optional<User> receiver=userRepository.findById(userId);
            if(receiver.isPresent()){
                List<FriendRequest> receiverFriendRequests=receiver.get().getFriendRequests();
                FriendRequest newFriendRequest=receiverFriendRequests.stream().filter((friendRequest)-> friendRequest.getId().equals(friendRequestId)).findFirst().orElse(null);
                if(newFriendRequest!=null){
                    receiverFriendRequests.remove(newFriendRequest);
                    Optional<User> sender=userRepository.findByUsername(newFriendRequest.getSenderUsername());
                    List<FriendRequest> senderFriendRequests=sender.get().getFriendRequests();
                    senderFriendRequests.remove(newFriendRequest);
                    receiver.get().setFriendRequests(receiverFriendRequests);
                    sender.get().setFriendRequests(senderFriendRequests);
                    userRepository.save(receiver.get());
                    userRepository.save(sender.get());
                    return new ResponseEntity<>(newFriendRequest,HttpStatus.NOT_ACCEPTABLE);
                }
                else
                    return new ResponseEntity<>("No friend request found with this id:"+friendRequestId,HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>("No user found with this id:"+userId,HttpStatus.NOT_FOUND);

        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param userId
     * @return
     */
    public ResponseEntity<?> getAllFriendRequests(String userId){
        Optional<User> user=userRepository.findById(userId);
        if(user.isPresent()){
            return new ResponseEntity<>(user.get().getFriendRequests(),HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
