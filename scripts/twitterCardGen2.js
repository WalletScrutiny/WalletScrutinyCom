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
                    -pointsize 26 -draw "text 370,270 \\"${title}\\"" \
                    -pointsize 18 -fill gray -draw "text 370,295 \\"version: ${version}\\"" \
                    -pointsize 18 -fill black -draw "text 370,330 \\"${verdict}\\"" \
                    -draw "stroke gray stroke-width 2 line 370,345 670,345" \
                    -pointsize 18 -draw "text 370,370 \\"Developer: ${developerName}\\"" \
                    -pointsize 18 -draw "text 370,395 \\"Downloads: ${users}\\"" \
                    -pointsize 18 -draw "text 370,420 \\"Released on: ${released}\\"" \
                    -pointsize 18 -draw "text 370,445 \\"Updated on: ${updated}\\"" \
                    -pointsize 18 -draw "text 370,470 \\"Latest review: ${date}\\"" \
                    ${iconPath} -geometry +220+250 -composite \
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
