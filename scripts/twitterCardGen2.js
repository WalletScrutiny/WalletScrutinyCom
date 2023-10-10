const fs = require('fs')
const { execSync } = require('child_process')

const directories = ['android', 'iphone', 'bearer', 'hardware']
const imageFolder = './images/wIcons'
const twcardFolder = './images/twcard'
const socialOutput = './images/social'

let totalFilesProcessed = 0
let totalErrors = 0
let startTime = Date.now()

directories.forEach((directory) => {
    const currentImageFolder = `${imageFolder}/${directory}/small` // Using the small folder for resized icons
    const mdFolder = `./_${directory}`
    const files = fs.readdirSync(currentImageFolder)

    files.forEach((file) => {
        if (file.endsWith('.png')) {
            const wsID = file.split('.png')[0]
            const mdFilePath = `${mdFolder}/${wsID}.md`

            if (fs.existsSync(mdFilePath)) {
                let data = fs.readFileSync(mdFilePath, 'utf8')

                const titleMatch = data.match(/title: (.+)/)
                const title = titleMatch ? titleMatch[1].replace('.', ',') : 'N/A'

                const versionMatch = data.match(/version: (.+)/)
                const version = versionMatch ? versionMatch[1].replace('.', ',') : 'N/A'

                const verdictMatch = data.match(/verdict: (.+)/)
                const verdict = verdictMatch ? verdictMatch[1].replace('.', ',').toUpperCase() : 'N/A'

                const releasedMatch = data.match(/released: (.+)/)
                const released = releasedMatch ? releasedMatch[1].replace('.', ',') : 'N/A'

                const updatedMatch = data.match(/updated: (.+)/)
                const updated = updatedMatch ? updatedMatch[1].replace('.', ',') : 'N/A'

                const dateMatch = data.match(/date: (.+)/)
                const date = dateMatch ? dateMatch[1].replace('.', ',') : 'N/A'

                const developerNameMatch = data.match(/developerName: (.+)/)
                const developerName = developerNameMatch ? developerNameMatch[1].replace('.', ',') : 'N/A'

                const usersMatch = data.match(/users: (.+)/)
                const users = usersMatch ? usersMatch[1].replace('.', ',') : 'N/A'

                try {
                const iconPath = `${currentImageFolder}/${wsID}.png`
                execSync(`convert ${twcardFolder}/twitterImageBGBig.png -font ./assets/fonts/Barlow/barlow-v12-latin-500.ttf \
                    -fill black \
                    -pointsize 26 -draw "text 230,170 \\"${title}\\"" \
                    -pointsize 18 -fill gray -draw "text 230,190 \\"version: ${version}\\"" \
                    -pointsize 18 -fill black -draw "text 230,210 \\"${verdict}\\"" \
                    -draw "stroke gray stroke-width 1 line 230,225 670,225" \
                    -pointsize 18 -fill black -draw "text 230,250 'Developer:'" -fill gray -draw "text 330,250 '${developerName}'" \
                    -pointsize 18 -fill black -draw "text 230,275 'Downloads:'" -fill gray -draw "text 330,275 '${users}'" \
                    -pointsize 18 -fill black -draw "text 230,300 'Released on:'" -fill gray -draw "text 330,300 '${released}'" \
                    -pointsize 18 -fill black -draw "text 230,325 'Updated on:'" -fill gray -draw "text 330,325 '${updated}'" \
                    -pointsize 18 -fill black -draw "text 230,350 'Latest review:'" -fill gray -draw "text 330,350 '${date}'" \
                    ${iconPath} -geometry +100+150 -composite \
                    ${socialOutput}/${directory}/${file}`)
                totalFilesProcessed++
            } catch (error) {
                console.error('Error processing file:', file, "Error message:", error.message)
                totalErrors++
            }


                
            }
        }
    })
})

let endTime = Date.now()
let totalTime = (endTime - startTime) / 1000

console.log(`Total files processed: ${totalFilesProcessed}`)
console.log(`Total errors: ${totalErrors}`)
console.log(`Total time it took to process: ${totalTime} seconds`)
