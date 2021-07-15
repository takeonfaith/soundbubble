export default function shortWord(word, len = 50){
	return word.substr(0, len) + (word.length > len?"...":"")
}