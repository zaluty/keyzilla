fun next(): Token {
    while (idx < input.length) {
       val char = input[idx++]
       if (PUNCTUATORS.containsKey(char)) {
           return Token(PUNCTUATORS[char]!!, char.toString())
       } else if (Character.isLetter(char)) {
        val start = idx - 1 
        while (idx < input.length) {
            if (!Character.isLetter(input[idx])) break
            idx++
        }
         val name = input.substring(start, idx)
         return Token(TokenType.NAME, name)
       }
          return Token(TokenType.EOF, "")
    }
}