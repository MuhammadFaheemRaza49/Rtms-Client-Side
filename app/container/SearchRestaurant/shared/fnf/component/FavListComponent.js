import React, {useEffect, useState} from 'react';
import { ScrollView, View } from 'react-native'
import SelectionButton from './SelectionButton'

import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {getAllFNF} from "../../../../../redux/favourite/operations";

const FavListComponent = ( {isUmrah=false,isShowPassportTag=false,selected=null,onChange}) => {
    const navigation=useNavigation()
    const dispatch = useDispatch()
    const apiToken = useSelector(state => state.user.userInfo.user.api_token);
    //nickname of selected fnf
    const [selectFnf, setSelectedFnf] = useState(selected)

    const {isFetching,fnfList} = useSelector(state => state.fav)

    useEffect(() => {
        dispatch(getAllFNF(apiToken))
    },[])


  useEffect(() => {



      setSelectedFnf(selected?.nickname);


  },[selected])


    const checkIsPassportImageExist=(fnf)=>{
        if (!fnf?.documents?.length===0)
            return false

        return fnf?.documents?.some(x=>x.identifier==='passport_front')


    }



  return (
        <ScrollView
            style={{ marginVertical: 10 }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}>
            {fnfList.map((value, index) =>
                <SelectionButton
                    isUmrah={isUmrah}
                    isShowPassportTag={isShowPassportTag}
                    isPassport={checkIsPassportImageExist(value)}
                    key={index.toString()}
                    title={value.nickname}
                    disable={value?.disable}
                    isSelected={selectFnf == value?.nickname}
                    onPress={() => {


                      if (selectFnf == value.nickname){
                        onChange(null,-1)
                        setSelectedFnf(null)
                      }else {
                        onChange(value,index)
                        setSelectedFnf(value?.nickname)
                      }


                    }}
                />)}

        </ScrollView>
  )
}

export default FavListComponent
