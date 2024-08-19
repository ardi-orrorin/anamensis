import {Root} from "@/app/{services}/types";

const removeSearchHistory = ({
    searchHistory,
    setSearchHistory,
    keyword,
}: {
    searchHistory: Root.SearchHistoryProps;
    setSearchHistory: React.Dispatch<React.SetStateAction<Root.SearchHistoryProps>>;
    keyword: string;
}) => {
    const newHistory = searchHistory.history.filter(key => key !== keyword);
    setSearchHistory({...searchHistory, history: newHistory});
    localStorage.setItem('searchHistory', JSON.stringify({...searchHistory, history: newHistory}));
}


const rootFunc = {
    removeSearchHistory,
}

export default rootFunc;